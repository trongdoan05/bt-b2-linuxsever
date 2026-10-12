import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://mern-backend-11311.onrender.com/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch('https://mern-backend-11311.onrender.com/api/students/' + editingId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        alert("Cập nhật thành công!");
        setEditingId(null);
      } else {
        await fetch('https://mern-backend-11311.onrender.com/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        alert("Thêm sinh viên thành công!");
      }
      setFormData({ studentId: '', name: '', email: '' }); 
      fetchStudents(); 
    } catch (error) {
      console.error('Lỗi xử lý form:', error);
    }
  };

  const handleEdit = (student) => {
    setFormData({ studentId: student.studentId, name: student.name, email: student.email });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await fetch('https://mern-backend-11311.onrender.com/api/students/' + id, { method: 'DELETE' });
        fetchStudents();
      } catch (error) {
        console.error('Lỗi xóa sinh viên:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>Hệ thống Quản lý Sinh viên - Trọng Đoàn</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <button type="submit" style={{ padding: '6px 15px', cursor: 'pointer', backgroundColor: editingId ? '#ffc107' : '#4CAF50', color: editingId ? 'black' : 'white' }}>
          {editingId ? 'Cập nhật' : 'Thêm'}
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ studentId: '', name: '', email: '' }) }} style={{ marginLeft: '10px', padding: '6px' }}>Hủy</button>}
      </form>

      <table border="1" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '8px' }}>MSSV</th>
            <th style={{ padding: '8px' }}>Họ tên</th>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px', textAlign: 'center' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td style={{ padding: '8px' }}>{student.studentId}</td>
              <td style={{ padding: '8px' }}>{student.name}</td>
              <td style={{ padding: '8px' }}>{student.email}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                <button onClick={() => handleEdit(student)} style={{ marginRight: '10px', cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => handleDelete(student._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;