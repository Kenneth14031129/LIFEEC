const mongoose = require('mongoose');

const connectDB = (url) => {
    console.log('Attempting to connect to MongoDB...');
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

// Add these connection event listeners
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('❌ MongoDB connection disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = connectDB;