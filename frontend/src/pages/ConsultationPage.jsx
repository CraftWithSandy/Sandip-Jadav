import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'
import Alert from '../components/Alert'
import Loader from '../components/Loader'

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to complete the request.'
}

// Record clinical notes and complete the selected appointment.
function ConsultationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ temperature: '', bloodPressure: '', notes: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const response = await api.get(`/appointments/${id}`)
        setAppointment(response.data)
      } catch (requestError) {
        setError(getErrorMessage(requestError))
      } finally {
        setLoading(false)
      }
    }
    loadAppointment()
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.notes.trim()) {
      setError('Notes are required to complete the consultation.')
      return
    }
    setSubmitting(true)
    try {
      await api.post(`/appointments/${id}/consultation`, form)
      setSuccess('Consultation completed. Returning to appointments...')
      setTimeout(() => navigate('/appointments'), 1500)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page-shell"><Loader label="Loading appointment..." /></div>
  if (error && !appointment) return <div className="page-shell"><Alert type="error">{error}</Alert><Link className="button ghost back-link" to="/appointments">Back to appointments</Link></div>

  const patient = appointment?.Patient
  const doctor = appointment?.Doctor
  const completed = appointment?.status === 'COMPLETED'

  return (
    <div className="page-shell narrow-page">
      <Link className="back-link" to="/appointments">← Back to appointments</Link>
      <div className="page-heading consultation-heading"><div><p className="eyebrow">CONSULTATION ROOM</p><h1>Patient consultation</h1><p className="page-subtitle">Record the clinical outcome for this appointment.</p></div><span className={`status-badge ${completed ? 'completed' : 'scheduled'}`}>{appointment?.status}</span></div>
      <section className="patient-banner"><div className="avatar">{patient?.name?.charAt(0) || '?'}</div><div><p className="eyebrow">PATIENT</p><h2>{patient?.name || 'Unknown patient'}</h2><p>{patient?.age ?? '—'} years <span>·</span> {patient?.gender || 'Gender not recorded'} <span>·</span> Appointment {new Date(appointment.appointmentDateTime).toLocaleString()}</p></div><div className="doctor-summary"><small>ATTENDING DOCTOR</small><strong>{doctor?.name || 'Unknown doctor'}</strong><span>{doctor?.specialization}</span></div></section>
      {completed ? <Alert type="success">This appointment has already been completed. The consultation form is disabled.</Alert> : <Alert type={success ? 'success' : 'error'}>{success || error}</Alert>}
      <section className="content-card consultation-card"><div className="section-title"><div><h2>Clinical notes</h2><p>Add the vitals and summary from today&apos;s visit.</p></div><span className="section-icon">♥</span></div><form onSubmit={handleSubmit} className="form-grid"><label className="field">Temperature<input disabled={completed || submitting} value={form.temperature} onChange={(event) => setForm({ ...form, temperature: event.target.value })} placeholder="e.g. 98.6 F" /></label><label className="field">Blood pressure<input disabled={completed || submitting} value={form.bloodPressure} onChange={(event) => setForm({ ...form, bloodPressure: event.target.value })} placeholder="e.g. 120/80" /></label><label className="field field-wide">Notes<textarea disabled={completed || submitting} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Write the consultation summary..." rows="6" />{!completed && error && <span className="field-error">{error}</span>}</label><div className="form-action"><button className="button primary" disabled={completed || submitting} type="submit">{submitting ? 'Completing...' : 'Complete consultation'}</button></div></form></section>
    </div>
  )
}

export default ConsultationPage
