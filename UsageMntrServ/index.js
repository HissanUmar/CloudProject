import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = 8000

const DAILY_MB_USE = 100
const MAX_STORAGE_LIM = 50

app.use(express.json());  // Make sure this is added before your routes

app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MONGODB connection error'));
db.once('open', () => console.log('Connected to MongoDB'));

const userSchema = new mongoose.Schema({
    dailyUsageMB: { type: Number, default: 0 },
    dataStoredMB: { type: Number, default: 0 },
    lastReset: { type: Date, default: new Date() },
  });

const User = mongoose.model('users', userSchema);

async function resetDailyUsage(user) 
{
  const now = new Date();
  if (user.lastReset.toDateString() !== now.toDateString()) 
  {
    user.dailyUsageMB = 0;
    user.lastReset = now;
    await user.save();
  }
}

function meetsUploadCriteria(user, fileSizeMB) 
{
  if (user.dailyUsageMB + ((fileSizeMB > 0) ? fileSizeMB : 0) > DAILY_MB_USE)
  {
    return 1;
  }
  if (user.dataStoredMB + fileSizeMB > MAX_STORAGE_LIM)
  {
    return 2;
  }
  return 0;
}

async function updateUserUsage(user, fileSizeMB) 
{ 
    if (fileSizeMB > 0)
    {
        user.dailyUsageMB += fileSizeMB;
    }
    user.dataStoredMB += fileSizeMB;
    await user.save();
}

app.post('/usage', async (req, res) => {
    const { userId, fileSizeMB } = req.body; // for delete request provide the fileSizeMB as -ve value.
    if (!userId || fileSizeMB === undefined) 
    {
      return res.status(400).json({ error: 'User ID and file size are required' });
    }
    try 
    {

      console.log("This is userID: ", userId);
      let user = await User.findOne({ '_id' : userId });
      if (!user) 
      {
        console.log("New Created");
        user = new User({ userId });
      }

      console.log(user)

      await resetDailyUsage(user);
      let return_code = meetsUploadCriteria(user, fileSizeMB)
      if (return_code) 
      {
        return res.json({ response: return_code });
      }
      await updateUserUsage(user, fileSizeMB);
  
      return res.json({ response: return_code });
    } 
    catch (err) 
    {
      console.error('Error processing usage request:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  app.get('/usage', async (req, res) => {
    const { userId } = req.query; 
    if (!userId) 
    {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try 
    {
        let user = await User.findOne({ userId });
        if (!user) 
        {
          user = new User({ userId });
        }
        await user.save();
        return res.json({ remainingStorage: (MAX_STORAGE_LIM - user.dataStoredMB),
                            remainingBandWidth: (DAILY_MB_USE - user.dailyUsageMB) })
    } 
    catch (err) 
    {
        console.error('Error processing usage request:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(PORT, () => {
  console.log(`Resource Monitor Service running on http://localhost:${PORT}`);
});