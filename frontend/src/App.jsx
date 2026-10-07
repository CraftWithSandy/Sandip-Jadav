import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import PatientsPage from './pages/PatientsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ConsultationPage from './pages/ConsultationPage'
import './App.css'

// Connect the application shell to each OPD workflow.
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<PatientsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/consultation/:id" element={<ConsultationPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
