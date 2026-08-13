import { Router } from 'express'
import { requireStaffAuth } from '../middleware/staffAuth.js'
import { listCompanies, getCompany, verifyCompany, rejectCompany } from '../controllers/staffCompanyController.js'

const router = Router()

router.use(requireStaffAuth)

router.get('/', listCompanies)
router.get('/:id', getCompany)
router.patch('/:id/verify', verifyCompany)
router.patch('/:id/reject', rejectCompany)

export default router
