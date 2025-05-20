import React, { useState } from 'react';
import GeoDashboard from './components/GeoDashboard';
import SavedGallery from './components/SavedGallery';
import ImageViewer from './components/ImageViewer';
import { colors, layout } from './styles/theme';

const styles = {
  app: {
    display: 'grid',
    gridTemplateColumns: `${layout.sidebarWidth} 1fr ${layout.rightPanelWidth}`,
    gridTemplateRows: '100vh',
    fontFamily: 'Segoe UI, Inter, sans-serif',
    backgroundColor: colors.background,
    color: colors.textPrimary,
    overflow: 'hidden',
  },
  sidebar: {
    backgroundColor: colors.panel,
    borderRight: `1px solid ${colors.border}`,
    padding: '1.5rem',
    overflowY: 'auto',
  },
  main: {
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '2rem',
  },
  rightPanel: {
    backgroundColor: colors.panel,
    borderLeft: `1px solid ${colors.border}`,
    padding: '1.5rem',
    overflowY: 'auto',
    boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.4)',
  },
};

function App() {
  const [result, setResult] = useState(null);
  const [zoom, setZoom] = useState(1);

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <GeoDashboard setResult={setResult} setZoom={setZoom} />
      </aside>

      <main style={styles.main}>
        <ImageViewer result={result} zoom={zoom} setZoom={setZoom} />
      </main>

      <aside style={styles.rightPanel}>
        <SavedGallery />
      </aside>
    </div>
  );
}

export default App;
