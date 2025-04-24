import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import auth from '../middleware/auth.js';
import Patient from '../models/patient.js';
const router = express.Router();
const JWT_SECRET = 'AR2904';

// 🔐 Register new user (doctor or assistant)
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });
if(!user.isVerified ){
  return res.status(401).json({ message: 'User not verified' });
}
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 👨‍⚕️ Get all doctors (filtered by role)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }); 
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all patients for a specific doctor
router.get('/my-patients', auth(['doctor']), async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctor = await User.findById(doctorId).populate('patients');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.status(200).json(doctor.patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve patients.' });
  }
});
// ✅ Get doctor by ID
router.get('/:id', auth(), async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch('/clear-all', auth(), async (req, res) => {
  try {
    await User.updateMany({ role: 'doctor' }, { $set: { patients: [] } });
    // Delete all patients
    await Patient.deleteMany({});

    res.status(200).json({ message: 'All doctor queues cleared successfully.' });
  } catch (err) {
    console.error('Error clearing queues:', err);
    res.status(500).json({ message: 'Failed to clear doctor queues.' });
  }
});
// Get all patients for a specific doctor
router.get('/by-doctor/:doctorId', auth(), async (req, res) => {
  try {
    const { doctorId } = req.params;

    const patients = await Patient.find({ doctor: doctorId });

    res.status(200).json(patients);
  } catch (err) {
    console.error('Error fetching patients for doctor:', err);
    res.status(500).json({ message: 'Failed to retrieve patients for this doctor.' });
  }
});

export default router;
