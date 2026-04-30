import express from 'express'
import { getAllPatients, getPatientById, getPatientNameById } from '../controllers/patientController.js'

const router = express.Router()

// /api/patients
router.get('/', getAllPatients)
router.get('/info/:id', getPatientById)
router.get('/name/:id', getPatientNameById )

export default router
