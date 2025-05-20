import React, { useState } from 'react';
import PresetGallery from './PresetGallery';
import { colors } from '../styles/theme';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontSize: '0.85rem',
    color: colors.textSecondary,
  },
  input: {
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    backgroundColor: '#0f172a',
    color: colors.textPrimary,
    border: `1px solid ${colors.border}`,
    fontSize: '1rem',
  },
  button: {
    padding: '0.6rem 0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    backgroundColor: colors.accent,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#0288d1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  header: {
    color: colors.textPrimary,
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
};

const GeoDashboard = ({ setResult, setZoom }) => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [date, setDate] = useState('');
  const [hover, setHover] = useState(false);

  const fetchImage = async (lat, lon, date) => {
    setResult(null);
    try {
      const res = await fetch(`/api/geo-data?lat=${lat}&lon=${lon}&date=${date}`);
      const data = await res.json();
      if (res.ok) {
        setResult({ ...data, lat, lon, date });
        setZoom(1);
      } else {
        alert(data.error || 'Failed to fetch image');
      }
    } catch {
      alert('Server error fetching data');
    }
  };

  const handleCustomSearch = () => {
    if (!lat || !lon || !date) {
      alert('Please fill in all fields');
      return;
    }
    fetchImage(lat, lon, date);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.section}>
        <div style={styles.header}>📍 Custom Location</div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Latitude</label>
          <input type="text" value={lat} onChange={e => setLat(e.target.value)} style={styles.input} />
          <label style={styles.label}>Longitude</label>
          <input type="text" value={lon} onChange={e => setLon(e.target.value)} style={styles.input} />
          <label style={styles.label}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />
          <button
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
            onClick={handleCustomSearch}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            🔎 Search NASA Image
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <PresetGallery onPresetSelect={fetchImage} />
      </div>
    </div>
  );
};

export default GeoDashboard;
