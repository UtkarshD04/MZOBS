import { Route, Routes, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Employee from './pages/Employee'
import EmployeeSignup from './pages/EmployeeSignup'
import EmployeeSignin from './pages/EmployeeSignin'
import Employer from './pages/Employer'
import EmployerSignup from './pages/EmployerSignup'
import EmployerSignin from './pages/EmployerSignin'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employees/signup" element={<EmployeeSignup />} />
        <Route path="/employees/signin" element={<EmployeeSignin />} />
        <Route path="/employers" element={<Employer />} />
        <Route path="/employers/signup" element={<EmployerSignup />} />
        <Route path="/employers/signin" element={<EmployerSignin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/employees/signup" element={<EmployeeSignup />} />
            <Route path="/employees/signin" element={<EmployeeSignin />} />
            <Route path="/employers" element={<Employer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

