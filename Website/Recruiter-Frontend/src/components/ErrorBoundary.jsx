import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

/**
 * Keeps a crash on one page from taking the whole app down. Without this, a
 * render error unmounts everything — nav bar included — so every link looks
 * dead. Rendered with `key={pathname}` so navigating away resets it.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-warn-soft text-warn"><AlertTriangle size={20} /></div>
        <h1 className="mt-3 text-[20px] font-bold">Something went wrong on this page</h1>
        <p className="mt-1 text-[13.5px] text-muted">The rest of Mzobs Talent still works — use the menu above, or try again.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button onClick={() => this.setState({ error: null })} className="h-9 rounded-full border border-line bg-white px-4 text-[13px] font-bold hover:bg-line-2">Try again</button>
          <Link to="/" className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-bold text-[#e8f8f5] hover:bg-accent">Back to search</Link>
        </div>
      </div>
    )
  }
}
