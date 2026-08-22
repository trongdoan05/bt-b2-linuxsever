import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  // CÂU 47: Gọi API lấy danh sách sinh viên qua Proxy
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm xử lý khi gõ vào ô input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CÂU 49: Gửi POST thêm sinh viên mới qua Proxy
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn load lại trang
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert("Thêm sinh viên thành công!");
        setFormData({ studentId: '', name: '', email: '' }); // Xóa trắng form
        fetchStudents(); // Cập nhật lại bảng dữ liệu
      }
    } catch (error) {
      console.error('Lỗi thêm sinh viên:', error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>Hệ thống Quản lý Sinh viên</h2>
      
      {/* CÂU 48: Form nhập MSSV, Họ tên, Email */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <button type="submit" style={{ padding: '6px 15px', cursor: 'pointer' }}>Thêm</button>
      </form>

      {/* Bảng hiển thị (thuộc CÂU 47) */}
      <table border="1" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '8px' }}>MSSV</th>
            <th style={{ padding: '8px' }}>Họ tên</th>
            <th style={{ padding: '8px' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td style={{ padding: '8px' }}>{student.studentId}</td>
                <td style={{ padding: '8px' }}>{student.name}</td>
                <td style={{ padding: '8px' }}>{student.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ padding: '8px', textAlign: 'center' }}>Chưa có sinh viên nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;