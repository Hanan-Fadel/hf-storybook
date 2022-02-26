const mongoose = require('mongoose');
MONGO_URI= 'MONGOURI'

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(MONGO_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (err)
    {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;
