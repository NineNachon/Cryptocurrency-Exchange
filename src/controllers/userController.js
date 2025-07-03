const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => { /* ... Logic สร้าง User ... */ };
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, 'YOUR_SECRET_KEY', { expiresIn: '1h' }); // ควรเก็บ secret key ไว้ใน .env

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};