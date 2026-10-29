import { Reveal } from '../mz/primitives'

export function AssociateSectionHeading({ eyebrow, title, description }) {
  return (
    <Reveal className="associate-section-heading">
      {eyebrow && <p className="associate-eyebrow">{eyebrow}</p>}
      <h2 className="associate-heading">{title}</h2>
      {description && <p className="associate-description">{description}</p>}
    </Reveal>
  )
}

export function AssociateCard({ title, description, icon: Icon, number, delay = 0, children }) {
  return (
    <Reveal as="li" delay={delay} className="associate-card">
      <span className={`associate-card-mark${number ? ' associate-card-mark--step' : ''}`} aria-hidden="true">
        {number ?? (Icon && <Icon size={20} strokeWidth={1.8} />)}
      </span>
      <h3 className="associate-card-title">{title}</h3>
      {description && <p className="associate-card-description">{description}</p>}
      {children}
    </Reveal>
  )
}
