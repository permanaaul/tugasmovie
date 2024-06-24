import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { emailOrUsername, password } = req.body;

      console.log('Received data:', { emailOrUsername, password });

      const db = readDB();

      const user = db.users.find(
        (user: any) =>
          (user.email === emailOrUsername || user.username === emailOrUsername) &&
          user.password === password
      );

      if (!user) {
        return res.status(401).json({ error: 'Invalid email/username or password' });
      }

      console.log('User logged in:', user);

      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
