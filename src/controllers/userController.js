// src/controllers/userController.js

const { User, Wallet, Currency } = require('../models');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await User.create({
            username,
            email,
            password
        });
        
        const currencies = await Currency.findAll();
        for (const currency of currencies) {
            await Wallet.create({
                user_id: user.id,
                currency_id: currency.id,
                balance: 0
            });
        }
        
        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        // --- ส่วนสำคัญสำหรับการดีบัก ---
        // 1. แสดง Error แบบละเอียดทั้งหมดออกมาใน Terminal
        console.error("DETAILED REGISTRATION ERROR:", error); 

        // 2. ตรวจจับ Error ประเภท Validation โดยเฉพาะ
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: 'Validation failed', errors: messages });
        }
        
        // 3. สำหรับ Error อื่นๆ ที่ไม่คาดคิด
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- โค้ดส่วน login และ getMe เหมือนเดิม ---
exports.login = async (req, res) => {
    try {
        console.log("1. Login endpoint hit!"); // จุดเช็กที่ 1
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log("Error: User not found.");
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("2. User found:", user.username); // จุดเช็กที่ 2

        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            console.log("Error: Password does not match.");
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log("3. Password matched!"); // จุดเช็กที่ 3

        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        console.log("4. Token generated. Sending response."); // จุดเช็กที่ 4

        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error("LOGIN FAILED WITH ERROR:", error); // จุดเช็ก Error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMe = async (req, res) => {
    try {
        // เราได้ user id มาจาก authMiddleware ที่เราทำไว้
        const user = await User.findByPk(req.user.id, {
            // ไม่ต้องดึงรหัสผ่านมาด้วยเพื่อความปลอดภัย
            attributes: ['id', 'username', 'email', 'createdAt'],
            // ดึงข้อมูล Wallet ของ user คนนี้มาด้วย
            include: {
                model: Wallet,
                as: 'wallets',
                attributes: ['balance'],
                include: {
                    model: Currency,
                    as: 'currency',
                    attributes: ['symbol']
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};