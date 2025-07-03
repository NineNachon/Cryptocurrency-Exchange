# Cryptocurrency Exchange Backend (โปรเจกต์ทดสอบ)

โปรเจกต์นี้เป็นระบบ Backend สำหรับเว็บไซต์แลกเปลี่ยนสกุลเงินดิจิทัล (Cryptocurrency) แบบ P2P (Peer-to-Peer)

---

## 🚀 คุณสมบัติหลัก (Features)

- **ระบบสมาชิก:** สมัครสมาชิกและเข้าสู่ระบบ
- **การยืนยันตัวตน:** ใช้ JWT (JSON Web Token) เพื่อความปลอดภัย
- **ระบบกระเป๋าเงิน:** ผู้ใช้แต่ละคนจะมี Wallet สำหรับทุกสกุลเงินโดยอัตโนมัติเมื่อสมัครสมาชิก
- **ระบบคำสั่งซื้อขาย:** ผู้ใช้สามารถตั้งคำสั่งขาย (SELL Order) สินทรัพย์ของตัวเองได้

---

เทคโนโลยีที่ใช้ (Tech Stack)

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** `jsonwebtoken` สำหรับสร้าง Token และ `bcryptjs` สำหรับเข้ารหัสผ่าน

---

## 📊 ER Diagram (แผนผังความสัมพันธ์ของฐานข้อมูล)

แผนผังนี้แสดงโครงสร้างและความสัมพันธ์ของตารางข้อมูลหลักในระบบ

erDiagram
    
    Users {
        int id PK
        string username
        string email
    }
    Wallets {
        int id PK
        decimal balance "ยอดเงิน"
    }

    Currencies {
        int id PK
        string symbol "ชื่อเหรียญ (BTC, ETH)"
    }

    Orders {
        int id PK
        string type "ประเภท (ซื้อ/ขาย)"
        decimal price "ราคา"
        decimal amount "จำนวน"
    }

    Users  Wallets : "มี"
    Users  Orders : "สร้าง"
    Currencies  Wallets : "เป็นของ"
    

## ⚙️ การติดตั้งและรันโปรเจกต์ (Setup & Run)

### สิ่งที่ต้องมีก่อน (Prerequisites)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 16 ขึ้นไป)
- [PostgreSQL](https://www.postgresql.org/download/)

### ขั้นตอนการติดตั้ง

1.  **Clone โปรเจกต์นี้ลงในเครื่องของคุณ:**
    ```bash
    git clone [https://github.com/NineNachon/Cryptocurrency-Exchange.git](https://github.com/NineNachon/Cryptocurrency-Exchange.git)
    ```

2.  **เข้าไปในโฟลเดอร์ของโปรเจกต์:**
    ```bash
    cd Cryptocurrency-Exchange
    ```

3.  **ติดตั้ง Dependencies ที่จำเป็นทั้งหมด:**
    ```bash
    npm install
    ```

4.  **ตั้งค่าฐานข้อมูล:**
    - เปิดโปรแกรม PostgreSQL และสร้างฐานข้อมูล (Database) ใหม่ชื่อว่า `crypto_p2p_db`
    - แก้ไขไฟล์ `config/config.json` และใส่ `username` กับ `password` ของ PostgreSQL ของคุณให้ถูกต้อง

5.  **สร้างตารางทั้งหมดในฐานข้อมูล:**
    ```bash
    npx sequelize-cli db:migrate
    ```

6.  **เพิ่มข้อมูลเริ่มต้น (ผู้ใช้ทดสอบและยอดเงิน):**
    ```bash
    npx sequelize-cli db:seed:all
    ```

7.  **รันเซิร์ฟเวอร์:**
    ```bash
    npm start
    ```
    เซิร์ฟเวอร์จะทำงานที่ `http://localhost:3000`

---

## 📡 วิธีทดสอบ API (API Endpoints)

คุณสามารถใช้โปรแกรมอย่าง [Postman](https://www.postman.com/) เพื่อทดสอบ API ต่างๆ ได้

### 👤 Users

- **สมัครสมาชิกใหม่:**
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/api/users/register`
  - **Body (JSON):**
    ```json
    {
        "username": "my_new_user",
        "email": "new_user@example.com",
        "password": "password123"
    }
    ```

- **เข้าสู่ระบบ:**
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/api/users/login`
  - **Body (JSON):**
    ```json
    {
        "email": "user_a@example.com",
        "password": "password123"
    }
    ```
  - **ผลลัพธ์:** คุณจะได้รับ `token` กลับมา ให้คัดลอกไว้ใช้ในขั้นตอนต่อไป

- **ดูข้อมูลโปรไฟล์:**
  - **Method:** `GET`
  - **URL:** `http://localhost:3000/api/users/me`
  - **Authorization:** เลือก `Bearer Token` แล้ววาง `token` ที่ได้จากการล็อกอิน

### 📦 Orders

- **ดูรายการขายทั้งหมด:**
  - **Method:** `GET`
  - **URL:** `http://localhost:3000/api/orders`

- **สร้างคำสั่งขาย:**
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/api/orders`
  - **Authorization:** ต้องใช้ `Bearer Token` ของผู้ใช้ที่ต้องการตั้งขาย
  - **Body (JSON):**
    ```json
    {
        "type": "SELL",
        "base_currency_id": 2,
        "quote_currency_id": 1,
        "price": "2100000",
        "amount": "0.1"
    }
    ```
