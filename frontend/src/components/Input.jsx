import './Input.css';

function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export default Input;