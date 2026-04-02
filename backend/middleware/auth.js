const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  // This middleware is used after auth middleware
  // In production, check isAdmin flag from database
  const adminToken = req.headers.authorization?.split(' ')[1];
  
  console.log('🔐 adminMiddleware - Authorization Header:', req.headers.authorization ? 'Present' : 'Missing');
  
  if (!adminToken) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    console.log('✅ Token decoded - Email:', decoded.email);
    console.log('🔍 Checking admin access - Expected: admin@bookexpress.com, Got:', decoded.email);
    
    // For simplicity in this demo, use a specific email as admin
    // In production, check isAdmin flag from database
    if (decoded.email !== 'admin@bookexpress.com') {
      console.log('❌ Access denied - Not admin email');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    console.log('✅ Admin access granted');
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authMiddleware, adminMiddleware };
