# Geospatial Data Viewer (Frontend Client)

A modern React application for fetching, viewing, and managing satellite imagery from NASA's Earth Imagery API. Users can search by coordinates and date, preview images, and save results to a MongoDB database via a custom backend.

---

## Features

- **Manual coordinate and date entry**
- **Preset location shortcuts** (Full Sail University, Washington D.C., Disney World)
- **Satellite image preview** with zoom controls
- **Save/delete imagery** to/from MongoDB
- **Persistent saved entries** sidebar
- **Responsive, panelized layout**
- **Snackbar feedback messages**

---

## Tech Stack

- **Frontend:** React (Vite), styled-components, Axios
- **Backend:** Express, MongoDB
- **API Source:** NASA Earth Imagery API
- **Testing:** Jest, Supertest

---

## Directory Structure

```
/src
    /components
        GeoDashboard.jsx      # Main layout and controller
        InputPanel.jsx        # Manual input for lat/lon/date
        PresetGallery.jsx     # Preset location buttons
        SavedGallery.jsx      # Saved entries sidebar
        ImageViewer.jsx       # Zoomable image preview
        SnackbarMessage.jsx   # Feedback messages
    /styles
        globalStyles.js       # Global CSS rules
        theme.js              # Color palette and constants
    App.jsx                 # App shell and routing
    main.jsx                # ReactDOM entry point
```

---

## Backend API Overview

The frontend communicates with a RESTful backend at:

```
http://localhost:5000/api/geo-data
```

| Method | Route                  | Description                                         |
|--------|------------------------|-----------------------------------------------------|
| GET    | /api/geo-data          | Fetch NASA image by lat, lon, and date              |
| POST   | /api/geo-data          | Save new imagery record to MongoDB                  |
| GET    | /api/geo-data/all      | Retrieve all saved entries (filters, pagination)    |
| GET    | /api/geo-data/:id      | Retrieve a specific entry by ID                     |
| DELETE | /api/geo-data/:id      | Delete an entry by ID                               |

**Query Parameters for `/api/geo-data/all`:**

- `fields=latitude,longitude` — limit returned fields
- `sort=-date` or `sort=+date` — sort by date
- `limit=2&page=1` — pagination
- `latMin`, `latMax`, `lonMin`, `lonMax`, `after`, `before`, `locationName` — filtering

---

## Getting Started

1. **Start the backend server**  
     ```bash
     cd geospatial-api-server
     npm install
     npm run dev
     ```

2. **Start the frontend client**  
     ```bash
     cd geospatial-api-client
     npm install
     npm run dev
     ```

3. **Open your browser:**  
     Visit [http://localhost:5173](http://localhost:5173)

4. **Usage:**  
     - Enter coordinates and date, or use preset buttons to fetch imagery
     - Zoom in/out on images
     - Save images to the database
     - View/delete saved entries in the sidebar

---

## Backend Testing

Tests are located in `/geospatial-api-server/tests` and cover:

- Field selection (`?fields=`)
- Pagination (`limit`, `page`)
- Sorting (`?sort=`)
- Status code and response validation
- 6 total tests (3 logic, 3 mock-based) using Jest and Supertest

---

## License

This project is for educational purposes.