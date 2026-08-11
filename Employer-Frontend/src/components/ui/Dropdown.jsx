import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { cn } from '../../lib/utils'

export default function Dropdown({ trigger, items, align = 'end' }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton as="div">{trigger}</MenuButton>
      <MenuItems
        transition
        anchor={align === 'end' ? 'bottom end' : 'bottom start'}
        className="z-[80] w-56 rounded-xl border border-border bg-surface shadow-lg p-1.5 origin-top-right transition duration-150 ease-out-premium data-[closed]:opacity-0 data-[closed]:scale-95 focus:outline-none [--anchor-gap:6px]"
      >
        {items.map((item, i) =>
          item === 'divider' ? (
            <div key={i} className="h-px bg-border my-1.5" />
          ) : (
            <MenuItem key={item.label} disabled={item.disabled}>
              <button
                onClick={item.onClick}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] font-medium cursor-pointer data-[focus]:bg-surface-hover disabled:opacity-45 disabled:cursor-not-allowed',
                  item.danger ? 'text-red' : 'text-ink'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </MenuItem>
          )
        )}
      </MenuItems>
    </Menu>
  )
}
