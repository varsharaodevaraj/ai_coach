const mongoose = require('mongoose');

async function connectDB(uri) {
    if(!uri){
        console.warn('[DB] No MONGODB_URI provided. Skipping DB connection.');
        return;
    }
    try{
        await mongoose.connect(uri,{
            autoIndex: true
        });
        console.log('[DB] Connected:', mongoose.connection.name);
        mongoose.connection.on('error', (err) => {
            console.error('[DB] Connection error:', err.message);
        });
    }catch(err){
        console.error('[DB] Failed to connect:', err.message);
        process.exit(1); // hard exit in dev so you notice
    }
}

module.exports = { connectDB };