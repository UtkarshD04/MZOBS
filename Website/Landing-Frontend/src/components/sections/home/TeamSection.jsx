import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { TEAM } from '../../../lib/content'

export default function TeamSection() {
  return (
    <section id="team" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text="Meet The Team Behind Mzobs" className="justify-center" />
          </h2>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <StaggerItem key={member.name}>
              <div className="group bg-[#F5F5F5] rounded-3xl p-5 text-center h-full flex flex-col items-center border border-transparent transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e0e0e0] hover:shadow-lg hover:bg-white">
                <div className="w-24 h-24 rounded-2xl mb-4 bg-white border border-[#e0e0e0] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[15px] font-black text-black">{member.name}</h3>
                <p className="text-[12px] text-[#666] font-bold mt-0.5">{member.role}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
