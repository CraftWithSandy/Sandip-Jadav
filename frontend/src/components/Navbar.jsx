import { NavLink } from 'react-router-dom'

// Provide the main navigation for the OPD module.
function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">+</span>
        <div>
          <strong>OPD Management</strong>
          <span>Outpatient care desk</span>
        </div>
      </div>
      <nav aria-label="Primary navigation">
        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/">Patients</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/appointments">Appointments</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
