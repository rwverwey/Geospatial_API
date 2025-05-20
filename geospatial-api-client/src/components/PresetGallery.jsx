import React from 'react';
import { colors } from '../styles/theme';

const PRESETS = [
  { label: 'Full Sail University 🎓', lat: 28.5891, lon: -81.2077, date: '2020-01-01' },
  { label: 'Washington, D.C. 🏛️', lat: 38.8895, lon: -77.0353, date: '2020-01-01' },
  { label: 'Disney World 🎢', lat: 28.4194, lon: -81.5812, date: '2020-01-01' },
];

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontWeight: 600,
    fontSize: '1rem',
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.card,
    color: colors.textPrimary,
    padding: '0.6rem 0.75rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s ease, transform 0.2s ease',
  },
  buttonHover: {
    backgroundColor: colors.accent,
    color: '#fff',
    transform: 'translateY(-1px)',
  },
};

const PresetGallery = ({ onPresetSelect }) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.title}>📌 Preset Locations</div>
      {PRESETS.map(({ label, lat, lon, date }, index) => (
        <button
          key={label}
          onClick={() => onPresetSelect(lat, lon, date)}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          style={{
            ...styles.button,
            ...(hoverIndex === index ? styles.buttonHover : {}),
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PresetGallery;
