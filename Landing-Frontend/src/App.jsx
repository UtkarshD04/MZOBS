import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Employee from './pages/Employee'
import Employer from './pages/Employer'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employers" element={<Employer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
