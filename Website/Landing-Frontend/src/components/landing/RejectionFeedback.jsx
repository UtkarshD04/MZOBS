import { Link } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES as R } from '../../lib/routes'
import './rejectionFeedback.css'

export default function RejectionFeedback() {
  return (
    <section ref={rootRef} className="rf" aria-labelledby="rf-title">
      <div className="rf-panel">
        <div className="rf-wrap">
          <div className="rf-story" data-r="">
            <p className="rf-eyebrow">A more transparent hiring experience</p>
            <h2 id="rf-title" className="rf-h2">Rejection shouldn&rsquo;t leave you <em>wondering why.</em></h2>
            <p className="rf-lede">At Mzobs, we believe every candidate deserves clarity. When an employer decides not to move forward, meaningful feedback helps candidates understand their improvement areas and prepare for better opportunities.</p>
            <p className="rf-pull">Because knowing where you stand is the first step towards moving forward.</p>
            <div className="rf-actions">
              <Link to={R.candidates} className="rf-btn solid">Explore Opportunities <span aria-hidden="true">→</span></Link>
              <a href="#move" className="rf-btn ghost">Discover How Mzobs Works</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
