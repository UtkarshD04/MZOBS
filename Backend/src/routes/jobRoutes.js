import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  setJobStatus,
  payJobInvoice,
  duplicateJob,
  deleteJob,
} from '../controllers/jobController.js'

const router = Router()

router.use(requireAuth)

router.get('/', listJobs)
router.post('/', createJob)
router.get('/:id', getJob)
router.put('/:id', updateJob)
router.patch('/:id/status', setJobStatus)
router.post('/:id/pay', payJobInvoice)
router.post('/:id/duplicate', duplicateJob)
router.delete('/:id', deleteJob)

export default router
