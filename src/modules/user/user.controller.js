import jwt from 'jsonwebtoken';
// const User = require('./user.schema');
import User from '../../../DB/models/user.model.js';

/* ========== TOKENS ========== */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  // The names of JWT Secrets here where different from the .env ones
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/* ========== AUTH ========== */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const user = await User.create({
      email,
      password,
      name,
      role: 'CUSTOMER'
    });
    
    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshTokens.push({ token: refreshToken });
    user.accessTokens.push({ token: accessToken });

    await user.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error' });
  }
};



/* ========== ADMIN ========== */
export const getAllUsers = async (req, res) => {
  const users = await User.find()
    .select('-password -refreshTokens');

  res.json({
    count: users.length,
    users
  });
};
