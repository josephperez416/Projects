// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connect } from './mongoConnect';
import ProfileModel from './profile'; // Make sure the path is correct according to your project structure

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Establish connection to MongoDB
connect('Cluster0');

// GET request to get all profiles
app.get('/api/profiles', async (req: Request, res: Response) => {
 
  try {
    const profiles = await ProfileModel.find({});
    res.json(profiles);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/api/login', async (req: Request, res: Response) => {
  
  const { gmail, password } = req.query;

  // It's important to hash the password using the same method used when storing it
  // Assuming passwords are hashed, you would compare the hashed versions
  // This example does a direct comparison, which is NOT secure for plain-text passwords

  try {
    const profile = await ProfileModel.findOne({ gmail, password });
    if (profile) {
      // Successful login (in real-world applications, consider returning a token instead)
      res.json(profile);
    } else {
      // Authentication failed
      res.status(401).send('Authentication failed');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST request to create a new profile
app.post('/api/signup', async (req: Request, res: Response) => {
 
  try {
    console.log(req.body);
    const { gmail, password } = req.body;
    const newProfile = new ProfileModel({ gmail, password });
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
