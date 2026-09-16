function StatusMessage({ message, type = 'success' }) {
  if (!message) return null;

  return <p className={`status-message ${type}`}>{message}</p>;
}

export default StatusMessage;
