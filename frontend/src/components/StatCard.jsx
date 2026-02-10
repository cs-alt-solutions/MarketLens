import React from 'react';

export const StatCard = ({ label, value, subValue, glowColor = 'purple', isAlert = false, onClick }) => {
  // Map simple color names to your global CSS variables/classes
  const getGlowClass = (color) => {
    if (color === 'teal') return 'glow-teal';
    if (color === 'purple') return 'glow-purple';
    if (color === 'orange') return 'glow-orange';
    if (color === 'red') return 'glow-red';
    if (color === 'cyan') return 'glow-cyan';
    return '';
  };

  const baseStyle = {
    background: isAlert ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-panel)',
    borderColor: isAlert ? 'var(--neon-red)' : 'var(--border-subtle)',
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <div className="panel-industrial" style={{ padding: '20px', justifyContent: 'center', ...baseStyle }} onClick={onClick}>
      <span className="label-industrial" style={{ color: isAlert ? '#fff' : 'var(--text-muted)' }}>
        {label}
      </span>
      <div className={`metric-value ${getGlowClass(glowColor)}`}>
        {value}
      </div>
      {subValue && (
        <div style={{ fontSize: '0.7rem', color: isAlert ? 'var(--neon-red)' : 'var(--text-muted)', marginTop: '4px' }}>
          {subValue}
        </div>
      )}
    </div>
  );
};