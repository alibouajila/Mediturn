import express from "express"
import mongoose from 'mongoose';
import patientRoutes from './routes/patient.js'
const app=express()
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/mediturn')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


  //Routes
app.use('/patients', patientRoutes);




app.listen(3000,()=>{
  console.log("Server is running on port")
})