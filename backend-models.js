// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// models/Employee.js
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  mobileNo: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  designation: {
    type: String,
    enum: ['HR', 'Manager', 'Sales'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  course: [{
    type: String,
    enum: ['MCA', 'BCA', 'BSC']
  }],
  image: {
    type: String, // Store file path
    validate: {
      validator: function(v) {
        return /\.(jpg|png)$/i.test(v);
      },
      message: 'Image must be jpg or png'
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Employee: mongoose.model('Employee', EmployeeSchema)
};
