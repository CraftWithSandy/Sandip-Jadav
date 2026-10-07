import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import Alert from '../components/Alert'
import Loader from '../components/Loader'

const emptyForm = { name: '', gender: '', age: '', phone: '' }

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to complete the request.'
}

// Register patients, search the directory, and open consultation history.
function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [history, setHistory] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const loadPatients = async (term = '') => {
    setLoading(true)
    try {
      const response = await api.get('/patients', { params: term ? { search: term } : {} })
      setPatients(response.data)
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadPatients(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.gender) nextErrors.gender = 'Select a gender.'
    if (form.age === '' || !Number.isInteger(Number(form.age)) || Number(form.age) < 0 || Number(form.age) > 120) {
      nextErrors.age = 'Age must be an integer from 0 to 120.'
    }
    if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = 'Phone must contain exactly 10 digits.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage({ type: '', text: '' })
    if (!validate()) return
    setSubmitting(true)
    try {
      await api.post('/patients', { ...form, age: Number(form.age) })
      setForm(emptyForm)
      setErrors({})
      setMessage({ type: 'success', text: 'Patient registered successfully.' })
      await loadPatients(search)
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  const openHistory = async (patient) => {
    setHistory(patient)
    setHistoryLoading(true)
    setHistoryError('')
    try {
      const response = await api.get(`/patients/${patient.id}/consultations`)
      setHistory({ ...patient, consultations: response.data })
    } catch (error) {
      setHistoryError(getErrorMessage(error))
    } finally {
      setHistoryLoading(false)
    }
  }

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  return (
    <div className="page-shell">
      <div className="page-heading">
        <div><p className="eyebrow">PATIENT DIRECTORY</p><h1>Patients</h1><p className="page-subtitle">Register and manage the people visiting your outpatient clinic.</p></div>
        <div className="heading-stat"><span>{patients.length}</span><small>shown today</small></div>
      </div>
      <Alert type={message.type} onClose={() => setMessage({ type: '', text: '' })}>{message.text}</Alert>

      <section className="content-card form-card">
        <div className="section-title"><div><h2>Register patient</h2><p>Capture the patient&apos;s basic details to create a record.</p></div><span className="section-icon">+</span></div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field field-wide">Full name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. Meera Joshi" />{errors.name && <span className="field-error">{errors.name}</span>}</label>
          <label className="field">Gender<select name="gender" value={form.gender} onChange={updateField}><option value="">Select gender</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select>{errors.gender && <span className="field-error">{errors.gender}</span>}</label>
          <label className="field">Age<input name="age" type="number" min="0" max="120" value={form.age} onChange={updateField} placeholder="Years" />{errors.age && <span className="field-error">{errors.age}</span>}</label>
          <label className="field">Phone number<input name="phone" inputMode="numeric" maxLength="10" value={form.phone} onChange={updateField} placeholder="10 digit number" />{errors.phone && <span className="field-error">{errors.phone}</span>}</label>
          <div className="form-action"><button className="button primary" disabled={submitting} type="submit">{submitting ? 'Registering...' : 'Register patient'}</button></div>
        </form>
      </section>

      <section className="content-card">
        <div className="table-toolbar"><div><h2>Patient list</h2><p>{search ? `Showing matches for “${search}”` : 'All registered patients'}</p></div><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or phone" /></label></div>
        {loading ? <Loader label="Loading patients..." /> : patients.length === 0 ? <div className="empty-state"><strong>No patients found</strong><span>Try a different search or register a new patient.</span></div> : <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Gender</th><th>Age</th><th>Phone</th><th>History</th></tr></thead><tbody>{patients.map((patient) => <tr key={patient.id}><td className="muted-cell">#{patient.id}</td><td className="patient-name">{patient.name}</td><td>{patient.gender || '—'}</td><td>{patient.age ?? '—'}</td><td>{patient.phone}</td><td><button className="button ghost" type="button" onClick={() => openHistory(patient)}>View history</button></td></tr>)}</tbody></table></div>}
      </section>

      {history && <div className="modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setHistory(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="history-title"><div className="modal-header"><div><p className="eyebrow">PATIENT HISTORY</p><h2 id="history-title">{history.name}</h2><p>{history.phone} {history.age !== null && `· ${history.age} years`}</p></div><button className="icon-button" type="button" onClick={() => setHistory(null)} aria-label="Close history">&times;</button></div>{historyLoading ? <Loader label="Loading history..." /> : historyError ? <Alert type="error">{historyError}</Alert> : history.consultations?.length ? <div className="history-list">{history.consultations.map((consultation) => <article className="history-item" key={consultation.id}><div className="history-date">{new Date(consultation.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}<span>{new Date(consultation.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div><div className="history-details"><strong>{consultation.Appointment?.Doctor?.name || 'Doctor not available'}</strong><div className="vitals"><span>Temp <b>{consultation.temperature || '—'}</b></span><span>BP <b>{consultation.bloodPressure || '—'}</b></span></div><p>{consultation.notes || 'No notes recorded.'}</p></div></article>)}</div> : <div className="empty-state compact"><strong>No completed consultations</strong><span>This patient has no consultation history yet.</span></div>}</section></div>}
    </div>
  )
}

export default PatientsPage
