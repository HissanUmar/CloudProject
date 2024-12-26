import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './user_model.js'
import connectDB from './db.js'
import cors from 'cors'
import fetchuser from './fetchuser.js'

const router = express.Router();

dotenv.config();
connectDB();

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    
    const { name, email, password } = req.body;

    console.log(req.body);

    if(!name || !email || !password){
        return res.status(400).json({ error: "Please specify all the fields" });
    }

    try{
        let user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({error: "A user with the email already exists." })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({authtoken, success:true});

    }
    catch(error){
        console.log("Errors: " + error.message);
    }
});



app.post('/login', async (req, res) => {

    const { email, password} = req.body;

    console.log(req.body);

    if(!email || !password){
        return res.status(400).json({error: "Bad request. Incomplete data."});
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({  error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ authtoken , success: true, message: "User successfully verified."});
    } catch (error) {
        res.json({error: error});
        console.log("Error: " + error.message);
    }
});

const get_username = async(userId) => {
    const user = await User.findById(userId); // Find user by ID
    console.log(user);
    return user.username;
}


// API endpoint to fetch username
app.get('/get-username', fetchuser, (req, res) => {
    const userId = req.userid; // Assuming the token contains user ID
  
    console.log('Back to the api from middleware',userId);
    // Fetch the user from the simulated DB
    const user = get_username(userId); // Find user by ID


    if (userId) {
        console.log("Response: correct.", userId);
        res.json({userId : userId}); // Return the username
      } 
      else {
        console.log('User not found');
        res.json({error: 'user not found'}); // User not found
      }  
  });


const port = 8080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

