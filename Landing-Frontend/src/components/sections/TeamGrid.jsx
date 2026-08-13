import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import TiltCard from '../ui/TiltCard'
import SectionHeading from './SectionHeading'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'

export default function TeamGrid({ eyebrow = 'OUR TEAM', title = 'Meet the People Behind Mzobs', subtitle, members }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />

      <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((m) => (
          <StaggerItem key={m.name}>
            <TiltCard className="bg-white rounded-2xl border border-slate-200/60 p-6 text-center shadow-sm hover:shadow-xl hover:border-slate-300 flex flex-col items-center h-full">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 border-2 border-slate-100 shadow-md group-hover:border-blue-500 group-hover:shadow-blue-500/20 transition-all duration-300 relative bg-slate-100">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out-premium" />
                ) : (
                  <Avatar initials={m.initials} size="lg" className="mx-auto" />
                )}
              </div>
              <h3 className="text-base font-bold text-[#0B1220] group-hover:text-blue-900 transition-colors">{m.name}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">{m.role}</p>
            </TiltCard>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}

