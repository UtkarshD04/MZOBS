import { z } from 'zod'

export const inviteSchema = z.object({
  name: z.string().min(2, 'Enter their full name'),
  email: z.string().email('Enter a valid work email'),
  role: z.enum(['Admin', 'Hiring Manager', 'Recruiter', 'Interviewer']),
})

export type InviteFormValues = z.infer<typeof inviteSchema>
