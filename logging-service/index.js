import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'




const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MONGODB connection error'));
db.once('open', () => console.log('Connected to MongoDB'));


const logSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    logs: [{
        event: String,
        status: String,
        timestamp: { type: Date, default: Date.now },
        fileName: String
    }]
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);



const loggingService = async(req, res) => {
    const { event, status, timestamp, user_id, fileName} = req.body;

    console.log('Received request with body:', req.body); // Debug log

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try{
        const userLog = await Log.findOne({ user_id });

        const newLogEntry = {
            event,
            status,
            timestamp: timestamp || new Date(),
            fileName: event === "upload" || event === "stream" || event === "delete" ? fileName : undefined
        };

        if (userLog) {
            await Log.updateOne(
                { user_id },
                { $push: { logs: newLogEntry } }
            );
            console.log('Log entry added for user:', user_id);
            res.status(200).json({ message: 'Logs stored successfully' });
        } else {
            const newLog = new Log({
                user_id,
                logs: [newLogEntry]
            });
            await newLog.save();
            console.log('New log entry created for user:', user_id);
            res.status(200).json({ message: 'Logs stored successfully (new entry)' });
        }


        // console.log('Log entry stored successfully for user:', user_id);
        // res.status(200).json({ message: 'Logs stored successfully' });
    }
    catch(err){
        console.error('Detailed error:', {
            message: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Failed to store logs',
            details: err.message
        });
    }
}

export default loggingService;


app.all("/logging", loggingService);

const PORT = 5000;

// Add connection test on startup
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});