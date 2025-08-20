// backend/jobs/reminderJob.js
const cron = require('node-cron');
const Attempt = require('../models/Attempt');
const { sendReminderMail } = require('../utils/mailer');

// ✅ Every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily revision reminder job...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(today.getDate() - 1);

  const yesterdayEnd = new Date(today);

  try {
    // 🔎 Find yesterday’s attempts that still need revision
    const attempts = await Attempt.find({
      needsRevision: true,
      reminderSent: { $ne: true }, // avoid spamming
      status: { $ne: 'solved' },
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
    }).populate('userId problemId', 'email name title');

    if (attempts.length === 0) {
      console.log('No revision reminders needed today.');
      return;
    }

    // 👥 Group attempts by user
    const userMap = {};
    attempts.forEach(a => {
      if (!userMap[a.userId._id]) {
        userMap[a.userId._id] = {
          email: a.userId.email,
          name: a.userId.name,
          problems: []
        };
      }
      userMap[a.userId._id].problems.push(a.problemId.title);
    });

    // 📩 Send reminder mail to each user
    for (const userId in userMap) {
      const { email, name, problems } = userMap[userId];

      await sendReminderMail(
        email,
        "⏰ Time to Revise!",
        `Hi ${name},\n\nYou need to revise these problems today:\n\n- ${problems.join("\n- ")}\n\nGood luck 🚀`
      );

      console.log(`📩 Sent reminder to ${email}`);
    }

    // ✅ Mark reminders as sent
    await Attempt.updateMany(
      { _id: { $in: attempts.map(a => a._id) } },
      { $set: { reminderSent: true } }
    );

    console.log('All reminders sent and flagged.');
  } catch (err) {
    console.error('Revision job failed:', err);
  }
});