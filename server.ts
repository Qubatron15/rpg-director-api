import express from 'express';
import { MongoClient } from 'mongodb';
import config from './config';

const app = express();
const client = new MongoClient(config.mongoUri || '');

app.use(express.json());

import { Request, Response } from 'express';

app.get('/ping', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/collections', async (req: Request, res: Response) => {
  try {
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    res.json(collections.map(c => c.name));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
