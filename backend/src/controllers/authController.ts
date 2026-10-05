import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.js';

// Default initial schedule routine for new users
const DEFAULT_INITIAL_ROUTINE = [
  { time: '08:00 AM', period: 'MORNING' as const, workGoal: 'DSA Practice', category: 'Study', description: 'Solve 2 LeetCode problems (Trees, DP)', order: 1 },
  { time: '09:30 AM', period: 'MORNING' as const, workGoal: 'Mathematics', category: 'Study', description: 'Calculus & Linear Algebra practice', order: 2 },
  { time: '11:30 AM', period: 'MORNING' as const, workGoal: 'Project Work', category: 'Development', description: 'Full-stack application architecture & coding', order: 3 },
  { time: '02:30 PM', period: 'AFTERNOON' as const, workGoal: 'System Design', category: 'Learning', description: 'Distributed systems & database scaling', order: 4 },
  { time: '05:00 PM', period: 'EVENING' as const, workGoal: 'Workout & Health', category: 'Health', description: 'Gym workout / 5km run', order: 5 },
  { time: '08:00 PM', period: 'EVENING' as const, workGoal: 'Tech Reading', category: 'Reading', description: 'Engineering blogs & tech documentation', order: 6 },
  { time: '10:00 PM', period: 'NIGHT' as const, workGoal: 'Daily Review', category: 'Productivity', description: 'Log progress, track habits & plan next day', order: 7 },
];

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Name is required.' });
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please login instead.',
      });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Automatically seed starter routine goals for new user
    try {
      await prisma.goal.createMany({
        data: DEFAULT_INITIAL_ROUTINE.map((g) => ({
          userId: user.id,
          time: g.time,
          period: g.period,
          workGoal: g.workGoal,
          category: g.category,
          description: g.description,
          order: g.order,
        })),
      });
    } catch (seedErr) {
      console.warn('Could not auto-seed default goals (safe to ignore):', seedErr);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please check your details and try again.',
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while logging in. Please try again.',
    });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error('getMe error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}
