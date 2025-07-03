// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.user = decoded; // เพิ่มข้อมูล user ที่ถอดรหัสแล้วเข้าไปใน request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed!' });
  }
};