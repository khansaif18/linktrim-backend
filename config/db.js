import mongoose from "mongoose"

let isConnected = false
let connectionPromise = null

const databaseConnection = async () => {
    try {
        if (isConnected) {
            return;
        }

        if (connectionPromise) {
            await connectionPromise;
            return;
        }

        connectionPromise = (async () => {

            await new Promise(resolve => setTimeout(resolve, 500));

            const opts = {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            }
            await mongoose.connect(process.env.MONGO_LOCAL_SERVER, opts) // MONGODB_URI MONGO_LOCAL_URI

            isConnected = true
            console.log('MongoDB Connected:', mongoose.connection.host)
        })();

        await connectionPromise;
        connectionPromise = null;

    } catch (error) {
        connectionPromise = null;
        console.error('MongoDB connection error:', error.message)
        throw error
    }
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
    isConnected = false
    connectionPromise = null;
})

mongoose.connection.once('connected', () => {
    isConnected = true;
    console.log('MongoDB connection established');
});

export default databaseConnection