// Show a consistent success or error message.
function Alert({ type = 'error', children, onClose }) {
  if (!children) return null
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onClose && <button className="alert-close" type="button" onClick={onClose} aria-label="Dismiss message">&times;</button>}
    </div>
  )
}

export default Alert
