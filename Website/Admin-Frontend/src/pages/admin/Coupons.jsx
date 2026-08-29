import { useState } from 'react'
import { Ticket, Plus } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../../hooks/useCoupons'

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscountAmount: '',
  minOrderAmount: '',
  usageLimit: '',
  expiresAt: '',
}

function toPayload(form) {
  return {
    code: form.code.trim().toUpperCase(),
    description: form.description.trim(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    maxDiscountAmount: form.discountType === 'percentage' && form.maxDiscountAmount !== '' ? Number(form.maxDiscountAmount) : null,
    minOrderAmount: form.minOrderAmount !== '' ? Number(form.minOrderAmount) : 0,
    usageLimit: form.usageLimit !== '' ? Number(form.usageLimit) : null,
    expiresAt: form.expiresAt || null,
  }
}

function CouponFormModal({ app, coupon, onDone }) {
  const isEdit = !!coupon
  const [form, setForm] = useState(
    coupon
      ? {
          code: coupon.code,
          description: coupon.description ?? '',
          discountType: coupon.discountType,
          discountValue: String(coupon.discountValue),
          maxDiscountAmount: coupon.maxDiscountAmount != null ? String(coupon.maxDiscountAmount) : '',
          minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : '',
          usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : '',
          expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
        }
      : EMPTY_FORM
  )
  const create = useCreateCouponMutation()
  const update = useUpdateCouponMutation()
  const pending = create.isPending || update.isPending

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit() {
    const payload = toPayload(form)
    const onSuccess = () => {
      app.addToast('success', isEdit ? `${payload.code} updated` : `${payload.code} created`)
      onDone?.()
      app.closeModal()
    }
    const onError = (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong')

    if (isEdit) {
      update.mutate({ id: coupon.id, ...payload }, { onSuccess, onError })
    } else {
      create.mutate(payload, { onSuccess, onError })
    }
  }

  const valid = form.code.trim() && form.discountValue !== '' && Number(form.discountValue) > 0

  return (
    <>
      <ModalHead title={isEdit ? 'Edit coupon' : 'Create coupon'} onClose={app.closeModal} />
      <ModalBody>
        <Field label="Coupon code">
          <Input value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="e.g. WELCOME50" className="uppercase tracking-wide font-mono" />
        </Field>
        <Field label="Description" optional>
          <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Internal note about this coupon" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discount type">
            <Select value={form.discountType} onChange={(e) => set('discountType', e.target.value)}>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat amount (₹)</option>
            </Select>
          </Field>
          <Field label={form.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}>
            <Input type="number" min="1" value={form.discountValue} onChange={(e) => set('discountValue', e.target.value)} />
          </Field>
        </div>
        {form.discountType === 'percentage' && (
          <Field label="Max discount amount (₹)" optional hint="Caps the rupee amount knocked off, even at a high percentage.">
            <Input type="number" min="1" value={form.maxDiscountAmount} onChange={(e) => set('maxDiscountAmount', e.target.value)} />
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Minimum order (₹)" optional>
            <Input type="number" min="0" value={form.minOrderAmount} onChange={(e) => set('minOrderAmount', e.target.value)} />
          </Field>
          <Field label="Usage limit" optional hint="Total redemptions allowed. Blank = unlimited.">
            <Input type="number" min="1" value={form.usageLimit} onChange={(e) => set('usageLimit', e.target.value)} />
          </Field>
        </div>
        <Field label="Expires on" optional>
          <Input type="date" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)} />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={pending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={pending || !valid}>
          {pending ? 'Saving...' : isEdit ? 'Save changes' : 'Create coupon'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Coupons() {
  const app = useApp()
  const { data: coupons = [], isLoading, isError, refetch } = useCouponsQuery()
  const updateCoupon = useUpdateCouponMutation()
  const deleteCoupon = useDeleteCouponMutation()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const activeCount = coupons.filter((c) => c.isActive).length
  const redemptions = coupons.reduce((n, c) => n + (c.usedCount || 0), 0)

  function toggleActive(c) {
    updateCoupon.mutate(
      { id: c.id, isActive: !c.isActive },
      {
        onSuccess: () => app.addToast('success', `${c.code} ${c.isActive ? 'deactivated' : 'activated'}`),
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  function remove(c) {
    if (!window.confirm(`Delete coupon ${c.code}? This cannot be undone.`)) return
    deleteCoupon.mutate(c.id, {
      onSuccess: () => app.addToast('success', `${c.code} deleted`),
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  function describe(c) {
    return c.discountType === 'percentage' ? `${c.discountValue}% off${c.maxDiscountAmount ? ` (up to ₹${c.maxDiscountAmount})` : ''}` : `₹${c.discountValue} off`
  }

  function isExpired(c) {
    return c.expiresAt && new Date(c.expiresAt) < new Date()
  }

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-ink-secondary mt-1">Create discount codes candidates can apply on the ₹299 placement programme payment.</p>
        </div>
        <Button variant="primary" onClick={() => app.openModal(<CouponFormModal app={app} onDone={refetch} />)}>
          <Plus size={15} /> Create coupon
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Total coupons</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={coupons.length} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Active</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={activeCount} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Times redeemed</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={redemptions} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        {coupons.length === 0 ? (
          <Card>
            <EmptyState icon={Ticket} title="No coupons yet" body="Create one to offer candidates a discount on the placement programme fee." />
          </Card>
        ) : (
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">{coupons.length} coupons</span>
            </CardHead>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Code', 'Discount', 'Min order', 'Usage', 'Expires', 'Status', '']}>
                {coupons.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <div className="font-mono font-semibold tracking-wide">{c.code}</div>
                      {c.description && <div className="text-xs text-ink-tertiary mt-0.5">{c.description}</div>}
                    </Td>
                    <Td>{describe(c)}</Td>
                    <Td>{c.minOrderAmount ? `₹${c.minOrderAmount}` : '—'}</Td>
                    <Td>
                      {c.usedCount || 0}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ''}
                    </Td>
                    <Td className={isExpired(c) ? 'text-red' : ''}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : 'Never'}</Td>
                    <Td>
                      <button onClick={() => toggleActive(c)} disabled={updateCoupon.isPending} className="cursor-pointer">
                        <Badge tone={!c.isActive ? 'gray' : isExpired(c) ? 'red' : 'green'}>{!c.isActive ? 'Inactive' : isExpired(c) ? 'Expired' : 'Active'}</Badge>
                      </button>
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => app.openModal(<CouponFormModal app={app} coupon={c} onDone={refetch} />)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => remove(c)} disabled={deleteCoupon.isPending}>
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
