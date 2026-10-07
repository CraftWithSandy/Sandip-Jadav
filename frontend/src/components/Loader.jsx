// Keep loading feedback visible while a request is in progress.
function Loader({ label = 'Loading...' }) {
  return <div className="loader" role="status"><span className="spinner" aria-hidden="true" />{label}</div>
}

export default Loader
