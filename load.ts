import axios from 'axios';
import { getDb } from './db';
import { User } from './models/User';
import { Post } from './models/Post';

export const loadData = async () => {
  try {
    const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
    const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const commentsResponse = await axios.get('https://jsonplaceholder.typicode.com/comments');

    const db = getDb();
    const usersCollection = db.collection('users');
    const postsCollection = db.collection('posts');
    const commentsCollection = db.collection('comments');

    const users: User[] = usersResponse.data;
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(users);

    const posts: Post[] = postsResponse.data.map((post: any) => {
      const postComments = commentsResponse.data.filter((comment: any) => comment.postId === post.id);
      return { ...post, comments: postComments };
    });

    await postsCollection.deleteMany({});
    await postsCollection.insertMany(posts);

    await commentsCollection.deleteMany({});
    await commentsCollection.insertMany(commentsResponse.data);

    console.log('Data loaded successfully!');
  } catch (err) {
    console.error('Error loading data:', err);
  }
};