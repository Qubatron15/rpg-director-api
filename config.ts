import dotenv from 'dotenv';
dotenv.config();

const dbPassword = process.env.DB_PASSWORD;
const mongoUri = process.env.MONGO_URI?.replace('${DB_PASSWORD}', dbPassword || '');

export default {
  mongoUri,
  port: 3000
};
