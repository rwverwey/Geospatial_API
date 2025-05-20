import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    textAlign: 'center',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  imageWrapper: {
    overflow: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    maxHeight: '70vh',
    background: '#f9f9f9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: (zoom) => ({
    transform: `scale(${zoom})`,
    transition: 'transform 0.3s ease, opacity 0.4s ease',
    transformOrigin: 'center center',
    display: 'block',
    maxWidth: '100%',
    margin: '0 auto',
  }),
  info: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  success: {
    color: 'green',
    marginTop: '0.5rem',
  },
  loadingText: {
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '1.1rem',
    fontStyle: 'italic',
  },
};

const ImageViewer = ({ result, zoom, setZoom }) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (result) {
      setLoading(true);
      setFadeIn(false);
    }
  }, [result]);

  if (!result) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#ccc',
        fontSize: '1.2rem',
      }}>
        No image loaded<br />Use the form or preset buttons to get started.
      </div>
    );
  }

  const handleImageLoad = () => {
    setTimeout(() => {
      setLoading(false);
      setFadeIn(true);
    }, 300); 
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/geo-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: 'Manual Entry',
          latitude: result.lat,
          longitude: result.lon,
          date: result.date,
          url: result.imageUrl,
          type: 'imagery',
          service_version: 'v1',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch {
      alert('Server error while saving');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <button style={styles.button} onClick={() => setZoom(zoom + 0.1)}>➕ Zoom In</button>
        <button style={styles.button} onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>➖ Zoom Out</button>
        <button style={styles.button} onClick={handleSave}>💾 Save to Database</button>
      </div>

      <div style={styles.imageWrapper}>
        {loading && (
          <div style={styles.loadingText}>
            Loading image...
          </div>
        )}

        <img
          src={result.imageUrl}
          alt="NASA satellite"
          onLoad={handleImageLoad}
          style={{
            ...styles.image(zoom),
            opacity: fadeIn ? 1 : 0,
          }}
        />
      </div>

      <div style={styles.info}>
        <p><strong>Date:</strong> {result.date}</p>
        <p><strong>Lat:</strong> {result.lat} | <strong>Lon:</strong> {result.lon}</p>
        {saveSuccess && <p style={styles.success}>Image saved successfully!</p>}
      </div>
    </div>
  );
};

export default ImageViewer;
