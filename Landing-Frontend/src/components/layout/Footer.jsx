import { FOOTER_DATA } from '../../lib/content'

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] text-white pt-20 pb-12 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <a href="#home" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-serif font-bold text-xl">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight">{FOOTER_DATA.logoText}</span>
                <span className="text-[9px] tracking-[0.2em] text-white/70 uppercase font-medium">{FOOTER_DATA.logoSub}</span>
              </div>
            </a>

            <p className="text-sm text-slate-400 leading-relaxed font-normal max-w-md">
              {FOOTER_DATA.desc}
            </p>

            <div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-[#0B1220] text-xs font-semibold hover:bg-slate-200 transition-colors shadow-sm"
              >
                {FOOTER_DATA.ctaText}
              </a>
            </div>
          </div>

          {/* Menu Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{FOOTER_DATA.menuTitle}</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {FOOTER_DATA.menuItems.map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{FOOTER_DATA.socialsTitle}</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {FOOTER_DATA.socialsItems.map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{FOOTER_DATA.contactTitle}</h4>
            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <p className="hover:text-white transition-colors cursor-pointer">{FOOTER_DATA.phone}</p>
              <p className="hover:text-white transition-colors cursor-pointer">{FOOTER_DATA.email}</p>
              <p className="pt-1">{FOOTER_DATA.address}</p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-normal">
          <p>{FOOTER_DATA.copyright}</p>
          <div className="flex items-center gap-4">
            {FOOTER_DATA.rightLinks.map((link, i) => (
              <span key={i} className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-300 transition-colors">
                  {link}
                </a>
                {i < FOOTER_DATA.rightLinks.length - 1 && <span className="text-slate-700">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
