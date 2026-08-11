import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import SectionHeading from './SectionHeading'

export default function TeamGrid({ eyebrow = 'OUR TEAM', title = 'Meet the People Behind Mzobs', subtitle, members }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((m) => (
          <Card key={m.name} pad hover className="text-center">
            <Avatar initials={m.initials} size="lg" className="mx-auto" />
            <h3 className="text-[14.5px] font-semibold mt-4">{m.name}</h3>
            <p className="text-[12.5px] text-ink-secondary mt-1">{m.role}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
