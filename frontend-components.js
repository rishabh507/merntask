import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Login Component
const Login = () => {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', credentials);
      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.userName);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Invalid login details');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={credentials.userName}
          onChange={(e) => setCredentials({...credentials, userName: e.target.value})}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Employee Create/Edit Component
const EmployeeForm = ({ employee, isEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    course: [],
    image: null
  });

  useEffect(() => {
    if (isEdit && employee) {
      setFormData(employee);
    }
  }, [employee, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'course') {
        formData[key].forEach(course => 
          formDataObj.append('course', course)
        );
      } else if (key !== 'image') {
        formDataObj.append(key, formData[key]);
      }
    });

    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      if (isEdit) {
        await axios.put(`/api/employees/${employee._id}`, formDataObj);
      } else {
        await axios.post('/api/employees', formDataObj);
      }
      // Redirect or refresh list
    } catch (error) {
      alert('Error saving employee');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Name" 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required 
      />
      <input 
        type="tel" 
        placeholder="Mobile No" 
        value={formData.mobileNo}
        onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
        required 
      />
      
      <select 
        value={formData.designation}
        onChange={(e) => setFormData({...formData, designation: e.target.value})}
        required
      >
        <option value="">Select Designation</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </select>

      <div>
        <label>
          <input 
            type="radio" 
            name="gender" 
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
          /> Male
        </label>
        <label>
          <input 
            type="radio" 
            name="gender" 
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
          /> Female
        </label>
      </div>

      <div>
        <label>
          <input 
            type="checkbox" 
            value="MCA"
            checked={formData.course.includes('MCA')}
            onChange={(e) => {
              const checked = e.target.checked;
              setFormData(prev => ({
                ...prev, 
                course: checked 
                  ? [...prev.course, 'MCA'] 
                  : prev.course.filter(c => c !== 'MCA')
              }));
            }}
          /> MCA
        </label>
        <label>
          <input 
            type="checkbox" 
            value="BCA"
            checked={formData.course.includes('BCA')}
            onChange={(e) => {
              const checked = e.target.checked;
              setFormData(prev => ({
                ...prev, 
                course: checked 
                  ? [...prev.course, 'BCA'] 
                  : prev.course.filter(c => c !== 'BCA')
              }));
            }}
          /> BCA
        </label>
        <label>
          <input 
            type="checkbox" 
            value="BSC"
            checked={formData.course.includes('BSC')}
            onChange={(e) => {
              const checked = e.target.checked;
              setFormData(prev => ({
                ...prev, 
                course: checked 
                  ? [...prev.course, 'BSC'] 
                  : prev.course.filter(c => c !== 'BSC')
              }));
            }}
          /> BSC
        </label>
      </div>

      <input 
        type="file" 
        accept=".jpg,.png"
        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
      />

      <button type="submit">{isEdit ? 'Update' : 'Create'} Employee</button>
    </form>
  );
};

// Employee List Component
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ 
    field: 'name', 
    order: 'asc' 
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees', {
        params: {
          page: pagination.currentPage,
          search: searchTerm,
          sort: sortConfig.field,
          order: sortConfig.order
        }
      });

      setEmployees(response.data.employees);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.currentPage, searchTerm, sortConfig]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      fetchEmployees();
    } catch