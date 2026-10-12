require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Bắt buộc phải có để Frontend (React) gọi được API

const app = express();

// --- Cấu hình CORS linh hoạt cho Production ---
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  credentials: true
}));

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

// CÂU 36: Lấy danh sách (GET)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CÂU 37: Thêm sinh viên (POST)
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// CÂU 38: Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa sinh viên thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống khi xóa: " + error.message });
    }
});

// CÂU 39: Cập nhật thông tin sinh viên (PUT)
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Trả về dữ liệu mới sau khi cập nhật
        );
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: "Lỗi hệ thống khi cập nhật: " + error.message });
    }
});

// --- CODE MỚI THÊM CHO BUỔI 6: API HEALTH CHECK ---
// CÂU 44: Health Check Endpoint cho Cloud PaaS Monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// --- LỆNH KHỞI ĐỘNG SERVER (Luôn nằm ở cuối file) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // CÂU 20: Đã sửa thông báo log để test Webhook Auto-Deploy
    console.log(`Server Backend (Auto-Deploy) đang chạy tại port ${PORT}`);
});