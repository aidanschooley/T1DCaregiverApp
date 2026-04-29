import express from 'express'
import { getCaregiverById } from '../controllers/caregiverController.js'

const router = express.Router()

router.get('/:id', getCaregiverById)

export default router
