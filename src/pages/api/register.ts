import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { email, username, password } = req.body;

      console.log('Received data:', { email, username, password });

      const db = readDB();

      if (db.users.find((user: any) => user.email === email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      if (db.users.find((user: any) => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        username,
        password,
        role: 'USER',
      };

      db.users.push(newUser);
      writeDB(db);

      console.log('New user registered:', newUser);

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
