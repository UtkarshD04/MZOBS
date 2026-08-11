import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as offersService from '../services/offersService'

export function useOffersQuery() {
  return useQuery({ queryKey: queryKeys.offers, queryFn: offersService.listOffers })
}

export function useCreateOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input) => offersService.createOffer(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offers })
      toast.success('Offer sent to candidate')
    },
    onError: () => toast.error('Could not create the offer.'),
  })
}

export function useUpdateOfferStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => offersService.updateOfferStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offers })
      toast.success('Offer status updated')
    },
  })
}
