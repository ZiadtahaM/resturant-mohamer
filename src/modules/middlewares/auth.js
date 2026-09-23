import jwt from 'jsonwebtoken';
import User from '../../../DB/models/user.model.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No access token' });

  const accessToken = authHeader.split(' ')[1];

  try {
    // ✅ access token صالح
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id);
    return next();
  } catch (err) {
    // ❌ access token منتهي
    if (err.name !== 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // 🔁 نحاول نعمل refresh
    const refreshToken = req.headers['x-refresh-token'];
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token' });

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await User.findOne({
        _id: decodedRefresh.id,
        'refreshTokens.token': refreshToken
      });

      if (!user)
        return res.status(401).json({ message: 'Refresh token not valid' });

      // 🔥 نطلع access token جديد
      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      res.setHeader('x-access-token', newAccessToken);
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
  }
};

export default auth;
