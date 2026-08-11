import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

export default function Accordion({ items }) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-surface">
      {items.map((item) => (
        <Disclosure key={item.question}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[13.5px] font-semibold cursor-pointer hover:bg-surface-hover">
                <span>{item.question}</span>
                <ChevronDown size={16} className={`text-ink-tertiary flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </DisclosureButton>
              <DisclosurePanel transition className="px-5 pb-4 text-[13px] text-ink-secondary leading-relaxed origin-top transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:-translate-y-1">
                {item.answer}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
