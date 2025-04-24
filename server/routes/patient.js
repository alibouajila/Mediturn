import express from 'express';
import Patient from '../models/patient.js';
import auth from '../middleware/auth.js';
import Doctor from '../models/user.js'; 
const router = express.Router();

// Register a new patient 
router.post('/register', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.use(auth());

// Verify a patient (only doctors or assistants can verify patients)
router.patch('/verify/:id', auth(['doctor', 'assistant']), async (req, res) => {
  const { doctorId } = req.body;

  try {
    // Step 1: Find and update the patient
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, doctor: doctorId }, // Add doctor reference to patient
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Step 2: Add patient to the doctor's list
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { patients: patient._id } } // prevents duplicates
    );

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Delete a patient
router.delete('/:id', auth(['doctor', 'assistant']), async (req, res) => {
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
router.get('/verified', auth(), async (req, res) => {
  try {
    const verifiedPatients = await Patient.find({ isVerified: true });
    res.status(200).json(verifiedPatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all unverified patients
router.get('/unverified', auth(), async (req, res) => {
  try {
    const unverifiedPatients = await Patient.find({ isVerified: false });
    res.status(200).json(unverifiedPatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
  