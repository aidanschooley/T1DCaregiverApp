import express from 'express'
import { getLatest, getByPatientId, createReading } from '../controllers/glucoseController.js'

const router = express.Router()

router.get('/latest', getLatest)
router.get('/:patientId', getByPatientId)
router.post('/', createReading)

export default router
