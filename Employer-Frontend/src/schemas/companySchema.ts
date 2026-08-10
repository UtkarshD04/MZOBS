import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  size: z.string().min(1, 'Select a company size'),
  founded: z.string().min(4, 'Enter a valid year'),
  website: z.string().min(3, 'Website is required'),
  linkedin: z.string().min(3, 'LinkedIn URL is required'),
  hq: z.string().min(2, 'Headquarters city is required'),
  about: z.string().min(20, 'Tell candidates a bit more about your company'),
})

export type CompanyFormValues = z.infer<typeof companySchema>
