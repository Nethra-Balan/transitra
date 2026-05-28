import jwt from 'jsonwebtoken';
import { User, Preferences } from '../models/index.js';
import { config } from '../config/index.js';

/**
 * Auth Controller
 * Handles user authentication and authorization
 */

export class AuthController {
  /**
   * Signup endpoint
   */
  static async signup(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        phone,
      });

      await user.save();

      // Create default preferences
      const preferences = new Preferences({
        userId: user._id,
      });

      await preferences.save();

      // Link preferences to user
      user.preferences = preferences._id;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login endpoint
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email }).populate('preferences');
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare passwords
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      res.json({
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.userId).populate('preferences');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { name, phone, language, accessibility } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          name,
          phone,
          language,
          accessibility,
        },
        { new: true }
      ).populate('preferences');

      res.json({
        message: 'Profile updated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}
