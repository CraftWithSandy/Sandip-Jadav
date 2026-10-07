import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import Alert from '../components/Alert'
import Loader from '../components/Loader'

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to complete the request.'
}

// Book appointments and monitor today's queue.
function AppointmentsPage() {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDateTime: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formError, setFormError] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [patientResponse, doctorResponse, appointmentResponse] = await Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments/today')])
      setPatients(patientResponse.data)
      setDoctors(doctorResponse.data)
      setAppointments(appointmentResponse.data)
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setMessage({ type: '', text: '' })
    if (!form.patientId || !form.doctorId || !form.appointmentDateTime) {
      setFormError('Patient, doctor, and appointment date/time are required.')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/appointments', { ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId) })
      setForm({ patientId: '', doctorId: '', appointmentDateTime: '' })
      setMessage({ type: 'success', text: 'Appointment booked successfully.' })
      const response = await api.get('/appointments/today')
      setAppointments(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-heading"><div><p className="eyebrow">CLINIC SCHEDULE</p><h1>Appointments</h1><p className="page-subtitle">Keep the day&apos;s patient queue moving with clarity.</p></div><div className="heading-stat"><span>{appointments.length}</span><small>appointments today</small></div></div>
      <Alert type={message.type} onClose={() => setMessage({ type: '', text: '' })}>{message.text}</Alert>
      <section className="content-card form-card"><div className="section-title"><div><h2>Book appointment</h2><p>Choose a patient, clinician, and time slot.</p></div><span className="section-icon">◷</span></div><form onSubmit={handleSubmit} className="form-grid appointment-form"><label className="field">Patient<select value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })}><option value="">Select patient</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} · {patient.phone}</option>)}</select></label><label className="field">Doctor<select value={form.doctorId} onChange={(event) => setForm({ ...form, doctorId: event.target.value })}><option value="">Select doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} · {doctor.specialization}</option>)}</select></label><label className="field">Date and time<input type="datetime-local" value={form.appointmentDateTime} onChange={(event) => setForm({ ...form, appointmentDateTime: event.target.value })} /></label><div className="form-action"><button className="button primary" disabled={submitting} type="submit">{submitting ? 'Booking...' : 'Book appointment'}</button></div></form>{formError && <p className="inline-form-error">{formError}</p>}</section>
      <section className="content-card"><div className="table-toolbar"><div><h2>Today&apos;s appointments</h2><p>Appointments are ordered by scheduled time.</p></div><button className="button ghost" type="button" onClick={loadData}>Refresh</button></div>{loading ? <Loader label="Loading schedule..." /> : appointments.length === 0 ? <div className="empty-state"><strong>No appointments today</strong><span>Booked appointments for today will appear here.</span></div> : <div className="table-wrap"><table><thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Action</th></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id}><td className="time-cell">{new Date(appointment.appointmentDateTime).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' })}</td><td className="patient-name">{appointment.Patient?.name || 'Unknown patient'}</td><td><span>{appointment.Doctor?.name || 'Unknown doctor'}</span><small className="table-subtext">{appointment.Doctor?.specialization}</small></td><td><span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span></td><td>{appointment.status === 'SCHEDULED' ? <Link className="button ghost" to={`/consultation/${appointment.id}`}>Start consultation</Link> : <span className="done-label">Done</span>}</td></tr>)}</tbody></table></div>}</section>
    </div>
  )
}

export default AppointmentsPage
