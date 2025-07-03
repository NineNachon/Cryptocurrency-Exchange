// src/controllers/orderController.js

const { Order, Wallet, sequelize } = require('../models');

// @desc    Get all open orders
// @route   GET /api/orders
// @access  Public
exports.getAllOpenOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { status: 'OPEN' } });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};


// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (requires login)
exports.createOrder = async (req, res) => {
    // ดึงข้อมูลจาก request body
    const { type, base_currency_id, quote_currency_id, price, amount } = req.body;
    // req.user.id มาจากตอนที่เรา login แล้ว middleware เอา token มาถอดรหัส
    const userId = req.user.id; 

    // เริ่ม Transaction เพื่อให้แน่ใจว่าทุกขั้นตอนสำเร็จทั้งหมด หรือไม่สำเร็จเลย
    const t = await sequelize.transaction();

    try {
        // --- ส่วน Logic สำหรับคน "ขาย" (SELL Order) ---
        if (type.toUpperCase() === 'SELL') {
            // 1. ตรวจสอบว่าผู้ใช้มีเหรียญ (base_currency) พอที่จะตั้งขายหรือไม่
            const sellerWallet = await Wallet.findOne({
                where: { user_id: userId, currency_id: base_currency_id },
                transaction: t // ทำให้ query นี้เป็นส่วนหนึ่งของ transaction
            });

            const sellAmount = parseFloat(amount);
            if (!sellerWallet || sellerWallet.balance < sellAmount) {
                await t.rollback(); // ถ้าเงินไม่พอ ให้ยกเลิกทุกอย่างที่ทำมา
                return res.status(400).json({ message: "Insufficient balance to place sell order." });
            }

            // 2. ถ้าเงินพอ ให้ "ล็อค" เงินจำนวนนั้นไว้ (ลด balance ใน wallet)
            sellerWallet.balance -= sellAmount;
            await sellerWallet.save({ transaction: t });
        }

        // (คุณสามารถเพิ่ม Logic สำหรับฝั่งซื้อ 'BUY' ได้ในลักษณะเดียวกัน)

        // 3. สร้าง Order ในตาราง Orders
        const newOrder = await Order.create({
            user_id: userId,
            type: type.toUpperCase(),
            base_currency_id,
            quote_currency_id,
            price,
            amount,
            remaining_amount: amount, // ตอนสร้าง order ใหม่ๆ remaining_amount จะเท่ากับ amount
            status: 'OPEN'
        }, { transaction: t }); // ทำให้การสร้างนี้เป็นส่วนหนึ่งของ transaction

        await t.commit(); // ยืนยันทุกขั้นตอนใน Transaction
        res.status(201).json({ message: 'Order created successfully!', order: newOrder });

    } catch (error) {
        await t.rollback(); // ถ้ามี error ให้ยกเลิกทั้งหมด
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};