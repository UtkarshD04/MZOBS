import { z } from 'zod'

export const jobSchema = z
  .object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    department: z.string().min(1, 'Select a department'),
    employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
    experienceMin: z.number().min(0, 'Cannot be negative').max(40, 'That seems too high'),
    experienceMax: z.number().min(0, 'Cannot be negative').max(40, 'That seems too high'),
    salaryMin: z.number().positive('Enter a valid minimum salary'),
    salaryMax: z.number().positive('Enter a valid maximum salary'),
    vacancies: z.number().int('Must be a whole number').min(1, 'At least 1 vacancy is required'),
    location: z.string().min(2, 'Location is required'),
    workMode: z.enum(['On-site', 'Hybrid', 'Remote']),
    skills: z.array(z.string()).min(1, 'Add at least one required skill'),
    description: z.string().min(40, 'Description should be at least 40 characters'),
    benefits: z.array(z.string()),
    deadline: z.string().min(1, 'Application deadline is required'),
  })
  .refine((d) => d.experienceMax >= d.experienceMin, { message: 'Max experience must be ≥ min experience', path: ['experienceMax'] })
  .refine((d) => d.salaryMax >= d.salaryMin, { message: 'Max salary must be ≥ min salary', path: ['salaryMax'] })

export const jobDefaultValues = {
  title: '',
  department: '',
  employmentType: 'Full-time',
  experienceMin: 0,
  experienceMax: 3,
  salaryMin: 0,
  salaryMax: 0,
  vacancies: 1,
  location: '',
  workMode: 'Hybrid',
  skills: [],
  description: '',
  benefits: [],
  deadline: '',
}
