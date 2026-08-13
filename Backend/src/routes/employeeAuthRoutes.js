import { Router } from 'express'
import { requireEmployeeAuth } from '../middleware/employeeAuth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { login, signup, getMe, updateMe } from '../controllers/employeeAuthController.js'

const router = Router()

router.post('/login', authLimiter, login)
router.post('/signup', authLimiter, signup)
router.get('/me', requireEmployeeAuth, getMe)
router.put('/me', requireEmployeeAuth, updateMe)

export default router
