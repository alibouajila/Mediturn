import express from 'express';
import Patient from '../models/Patient.js';

const router = express.Router();

// Create a new patient (just for test )
router.post('/register', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Verify a patient
router.patch('/verify/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all verified patients
router.get('/verified', async (req, res) => {
    try {
      const verifiedPatients = await Patient.find({ isVerified: true });
      res.status(200).json(verifiedPatients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  // Get all unverified patients
router.get('/unverified', async (req, res) => {
    try {
      const verifiedPatients = await Patient.find({ isVerified: false });
      res.status(200).json(verifiedPatients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
export default router;
