import express, { Request, Response, Router } from 'express';
import { User } from '../models/User';
import { getDb } from '../db';

const router: Router = express.Router();

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id, 10);
  const db = getDb();

  try {
    const user = await db.collection('users').findOne({ id: userId });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const posts = await db.collection('posts').find({ userId }).toArray();
    res.status(200).json({ ...user, posts });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const db = getDb();
  const userData: User = req.body;

  try {
    if (!userData.id || !userData.name || !userData.email) {
      res.status(400).json({ message: 'Missing required user fields (id, name, email)' });
      return;
    }

    const existingUser = await db.collection('users').findOne({ id: userData.id });
    if (existingUser) {
      res.status(409).json({ message: 'User with this ID already exists' });
      return;
    }

    await db.collection('users').insertOne(userData);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const db = getDb();
  const userId = parseInt(req.params.id, 10);
  const updates = req.body;

  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  try {
    const result = await db.collection('users').updateOne(
      { id: userId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// DELETE /users/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id, 10);
  const db = getDb();

  try {
    const userPosts = await db.collection('posts').find({ userId }).toArray();
    const postIds = userPosts.map((post: any) => post.id);

    const result = await db.collection('users').deleteOne({ id: userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await db.collection('posts').deleteMany({ userId });
    await db.collection('comments').deleteMany({ postId: { $in: postIds } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;