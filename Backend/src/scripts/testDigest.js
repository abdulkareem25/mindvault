import '../config/env.js'; // load environment variables
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Memory from '../models/Memory.js';
import Chat from '../models/chat.model.js';
import Digest from '../models/Digest.js';
import { checkAndScheduleDigest, generateAndSaveDigest } from '../services/digest.service.js';

async function run() {
  console.log('Connecting to database...');
  await connectDB();
  
  // Find or create test user
  let user = await User.findOne({ email: 'test_digest@example.com' });
  if (!user) {
    user = await User.create({
      name: 'Digest Tester',
      email: 'test_digest@example.com',
      password: 'password123',
      isVerified: true
    });
    console.log('Created test user:', user._id);
  } else {
    console.log('Using existing test user:', user._id);
  }

  // Clean up any old digests/memories/chats for this user
  await Digest.deleteMany({ userId: user._id });
  await Memory.deleteMany({ userId: user._id });
  await Chat.deleteMany({ userId: user._id });
  
  // Create 3 memories created in the last 7 days
  const now = new Date();
  await Memory.create([
    {
      userId: user._id,
      content: 'Decided to use Mongoose instead of raw MongoDB for the database layer.',
      category: 'coding',
      type: 'decision',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      userId: user._id,
      content: 'Learned that Agenda.js is incredibly easy to configure for delayed jobs.',
      category: 'coding',
      type: 'learning',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      userId: user._id,
      content: 'Goal: Launch the MVP of MindVault by Friday evening.',
      category: 'life',
      type: 'goal',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);
  console.log('Created 3 test memories.');

  // Create a chat active in the last 7 days
  const chat = await Chat.create({
    userId: user._id,
    category: 'coding',
    title: 'Database Architecture Discussion',
    lastMessageAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
  });
  console.log('Created test chat:', chat.title);

  // Test 1: Check and Schedule Digest
  console.log('Running checkAndScheduleDigest...');
  await checkAndScheduleDigest(user._id);

  // Let's check if the job is scheduled in the DB
  const jobsCollection = mongoose.connection.db.collection('agendaJobs');
  const job = await jobsCollection.findOne({ name: 'generate-digest', 'data.userId': user._id });
  if (job) {
    console.log('SUCCESS: Digest generation job scheduled in Agenda!', job);
  } else {
    console.log('FAILURE: Digest generation job not found in Agenda.');
  }

  // Test 2: Generate and save digest (invokes Groq AI Service)
  console.log('Running generateAndSaveDigest (invoking Groq)...');
  const digest = await generateAndSaveDigest({ userId: user._id });
  console.log('SUCCESS: Digest generated and saved:\n', digest.content);

  // Test 3: Check checkAndScheduleDigest again (should NOT schedule since last digest was just created)
  console.log('Running checkAndScheduleDigest again (should NOT schedule)...');
  await jobsCollection.deleteMany({ name: 'generate-digest', 'data.userId': user._id });
  await checkAndScheduleDigest(user._id);
  const reScheduledJob = await jobsCollection.findOne({ name: 'generate-digest', 'data.userId': user._id });
  if (!reScheduledJob) {
    console.log('SUCCESS: Digest not scheduled because <7 days have passed.');
  } else {
    console.log('FAILURE: Digest scheduled even though last digest was <7 days ago.');
  }

  // Done! Clean up test user's data
  console.log('Cleaning up test data...');
  await Digest.deleteMany({ userId: user._id });
  await Memory.deleteMany({ userId: user._id });
  await Chat.deleteMany({ userId: user._id });
  await User.deleteOne({ _id: user._id });
  await jobsCollection.deleteMany({ name: 'generate-digest', 'data.userId': user._id });
  
  await mongoose.disconnect();
  console.log('Verification script completed successfully.');
}

run().catch(err => {
  console.error('Test run failed:', err);
  mongoose.disconnect();
});
