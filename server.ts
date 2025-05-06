import express from 'express';
import { MongoClient } from 'mongodb';
import config from './config';

const app = express();
console.log('Mongo URI:', config.mongoUri);
const client = new MongoClient(config.mongoUri || '');

app.use(express.json());

import { Request, Response } from 'express';

app.get('/ping', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/collections', async (req: Request, res: Response) => {
  console.log('Received GET /collections request');
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    console.log('Using database:', db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    res.json(collections.map(c => c.name));
  } catch (err: any) {
    console.error('Error in /collections:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
    console.log('Closed MongoDB connection');
  }
});

app.get('/dbinfo', async (req: Request, res: Response) => {
  try {
    await client.connect();
    const db = client.db();
    res.json({ databaseName: db.databaseName });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
