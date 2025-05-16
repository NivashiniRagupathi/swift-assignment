import express from 'express';
import { connectToDb } from './db';
import userRoutes from './routes/users';
import { loadData } from './load';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/users', userRoutes);

app.get('/load', async (req, res) => {
  await loadData();
  res.send('Data loaded successfully');
});

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});