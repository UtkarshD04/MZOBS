import { Router } from 'express'
import { requireEmployeeAuth } from '../middleware/employeeAuth.js'
import { getSubscription, paySubscription } from '../controllers/employeeSubscriptionController.js'

const router = Router()

router.get('/', requireEmployeeAuth, getSubscription)
router.post('/pay', requireEmployeeAuth, paySubscription)

export default router
