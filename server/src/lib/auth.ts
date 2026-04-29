import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export const generateTokens = (user: { id: string; email: string }) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
