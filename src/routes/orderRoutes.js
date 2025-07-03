const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const authMiddleware = require('../middleware/auth'); // <-- import Middleware

// GET /api/orders  -> ดึงรายการ order ทั้งหมด (ไม่ต้อง login)
// router.get('/', orderController.getAllOpenOrders);

// POST /api/orders -> สร้าง order ใหม่ (ต้อง login)
router.post('/', authMiddleware, orderController.createOrder); // <-- ใช้ Middleware ที่นี่

module.exports = router;