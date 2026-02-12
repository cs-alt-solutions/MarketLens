/* src/components/InputGroup.jsx */
import React from 'react';

export const InputGroup = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  prefix, 
  step,
  autoFocus = false,
  onKeyDown
}) => {
  return (
    <div className="lab-form-group">
      {label && <label className="label-industrial">{label}</label>}
      <div className="input-group-wrapper">
        {prefix && (
          <span className="input-prefix">{prefix}</span>
        )}
        <input 
          className={`input-industrial ${prefix ? 'has-prefix' : ''}`}
          type={type} 
          step={step}
          value={value} 
          onChange={onChange} 
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </div>
    </div>
  );
};