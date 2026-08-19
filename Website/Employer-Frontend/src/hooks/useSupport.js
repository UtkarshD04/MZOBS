import { useMutation } from '@tanstack/react-query'
import * as supportService from '../services/supportService'

export function useSubmitTicket() {
  return useMutation({ mutationFn: (input) => supportService.submitTicket(input) })
}
