import React, { useState } from 'react';
import Snackbar from './Snackbar';

const styles = {
  heading: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '0.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  meta: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#444',
    lineHeight: '1.4',
  },
  deleteBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'transparent',
    border: 'none',
    color: '#e53e3e',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  deleteBtnHover: {
    color: '#c53030',
  },
};

const SavedGallery = ({ saved, setSaved }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [snackbar, setSnackbar] = useState('');

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this saved image?')) return;

    try {
      const res = await fetch(`/api/geo-data/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setSaved(prev => prev.filter(entry => entry._id !== id));
        showSnackbar('Image deleted');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch {
      alert('Failed to delete entry');
    }
  };

  return (
    <div>
      <h3 style={styles.heading}>Saved Images</h3>
      <div style={styles.list}>
        {saved.map((item) => (
          <div key={item._id} style={styles.card}>
            <button
              style={{
                ...styles.deleteBtn,
                ...(hoveredId === item._id ? styles.deleteBtnHover : {}),
              }}
              onClick={() => handleDelete(item._id)}
              onMouseEnter={() => setHoveredId(item._id)}
              onMouseLeave={() => setHoveredId(null)}
              title="Delete this entry"
            >
              ✖
            </button>
            <img src={item.url} alt="Saved NASA" style={styles.image} />
            <div style={styles.meta}>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Lat:</strong> {item.latitude} | <strong>Lon:</strong> {item.longitude}</p>
              <p><em>{item.locationName || '—'}</em></p>
            </div>
          </div>
        ))}
      </div>

      <Snackbar message={snackbar} />
    </div>
  );
};

export default SavedGallery;
