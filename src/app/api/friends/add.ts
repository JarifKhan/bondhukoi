
import connectToDatabase from "@/libs/mongodb";
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { friendId } = req.body;

  try {
    await connectToDatabase();

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: 'User not found' });

    // Prevent adding duplicate friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
