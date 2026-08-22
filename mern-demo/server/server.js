require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Bắt buộc phải có để Frontend (React) gọi được API

const app = express();

// Bật CORS cho toàn bộ server
app.use(cors());

// Cho phép Express đọc được dữ liệu JSON gửi lên
app.use(express.json());

// --- PHẦN 4: KẾT NỐI MONGODB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.log("Lỗi kết nối:", err));

// --- PHẦN 5: API ---
// CÂU 35: Tạo Model
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// CÂU 36: Lấy danh sách
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CÂU 37: Thêm sinh viên
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- LỆNH KHỞI ĐỘNG SERVER (Luôn nằm ở cuối file) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend đang chạy tại port ${PORT}`);
});