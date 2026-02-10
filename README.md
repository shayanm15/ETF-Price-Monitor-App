# ETF Price Monitor


## Overview

The ETF Price Monitor is a single-page web application that acts as an analytic dashboard for traders to visually explore historical prices for an ETF and its top holdings. The app prompts the user to drag-and-drop or upload a CSV file containing ETF constituents and their portfolio weights.

On upload, the application runs validation to ensure the file is usable. It checks that the CSV includes the required columns (`name` and `weight`), verifies that weights are valid non-negative numeric values, ensures the file is not empty, checks for duplicate constituents in the uploaded file, and confirms that each uploaded constituent exists in the server's historical price dataset (`prices.csv`).

Once validation passes, the dashboard renders three key views:
- An interactive table displaying the latest close price for each constituent.
- A zoomable time-series line chart showing the ETF price over time, calculated as the weighted sum of constituent prices per date.
- A bar chart showing the top 5 holdings by holding size, based on (weight × latest close price).


## Running the App

**Clone the repository**
```bash
git clone <repo url>
cd ETF-Price-Monitor-App
```

**Start the backend**
```bash
cd backend
npm install
npm run dev
```

**Start the frontend**
```bash
cd frontend
npm install
npm run dev
```

**Local URLs**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`


## Input Files

### Uploaded ETF CSV (user upload)

Your uploaded file must:
- Use comma delimiters
- Contain columns: `name`, `weight`
- Use constituent names that match the headers in `prices.csv` (case-sensitive)
- Must be 1 CSV file

Example format:
```csv
name,weight
A,0.15
B,0.75
```

### prices.csv (server-side)

- `prices.csv` is preloaded on the backend at: `backend/data/prices.csv`
- It contains historical price data for the ETF constituents (each constituent appears as a column header)


## Validation Rules (Error Checking)

When an ETF CSV is uploaded, the backend validates the file by enforcing the following rules:
- The file is not empty
- The CSV contains `name` and `weight` columns
- All weights are numeric
- All weights are non-negative numbers (weights >= 0)
- Every uploaded constituent in the ETF CSV exists as a column in `prices.csv`
- All uploaded constituents must be unique (no duplicates)

If any check fails, the API returns a clear error message with status 400. The UI will display the returned server-side error message in an action alert immediately.


## Assumptions

### Data Assumptions
- `prices.csv` is sorted chronologically, and the most recent date is the last row
- All price values in `prices.csv` are valid numeric values
- There are no missing or null price values
- Uploaded constituent names match `prices.csv` headers exactly (case-sensitive)
- Users can upload one ETF file at a time
- Users upload only the ETF constituent file (not `prices.csv`)

### Calculation Assumptions
- ETF price is computed per date as: `ETF price = Σ (weightᵢ × priceᵢ)`
- "Top 5 holdings" is based on holding size, not weight alone: `holding size = weight × latest close price`

### Architecture Assumptions
- The backend runs on `localhost:3001` and the frontend on `localhost:5173`
- No authentication or authorization is required
- No database is used; results are computed and held in memory/state
- Uploaded files are small enough to process in memory (using `multer` memory storage)


## Tech Stack & Design Choices

### React + Node.js (Express)
- A full JavaScript stack keeps both the frontend and backend in the same language, which reduces programming language context switching and promotes using easier patterns (validation, data shapes, transformation logic).
- React's component model maps naturally to a dashboard layout, where each visualization is its own component with its own logic and rendering lifecycle.
- Express is a lightweight and appropriate choice for handling CSV uploads and returning computed analytics via REST APIs.

### Material UI (MUI)
- MUI DataGrid provides grid interactions of sorting, pagination, and column resizing, which reduces developer bottleneck as these table features do not need to be reinvented.
- MUI provides a consistent design of components and systems (spacing, typography, layout patterns) with good accessibility defaults—important for responsive and scalable dashboards.
- MUI is commonly used in enterprise projects/teams and is production-grade.

### Recharts
- Recharts is React-native and uses declarative components like `<LineChart />` and `<BarChart />`, which keeps visualizations readable and maintainable.
- Built-in interactive features (tooltips, zoom/brush) work with minimal configuration.
- Responsive containers make charts adapt cleanly across screen sizes.

## UI Design & Layout
- The dashboard uses a CSS Grid with `grid-template-columns: 1fr 2fr`, creating a two-column layout where the left column (file upload and constituent table) takes up 1/3 of the width and the right column (time series and top holdings charts) takes up 2/3.
- This layout displays all visualizations, charts, and tables on a single view without requiring the user to scroll, making it easy to analyze ETF data at a glance.
- UI is designed to be responsive for tablet and mobile screens (below 1050px), the grid collapses to a single column (`1fr`) so components stack vertically for accessible readability.

## Backend & API Design
- The backend uses Node.js (Express) running on port 3001 and follows a **route → controller → service** layered pattern to separate concerns:
  - **Route** (`file.route.js`): Defines the REST endpoint and configures `multer` middleware for parsing multipart/form-data file uploads into memory.
  - **Controller** (`file.controller.js`): Handles request-level validation (e.g., no file uploaded, non-CSV file type), delegates business logic to the service, and returns the JSON response.
  - **Service** (`file.service.js`): Contains all data validation (missing columns, invalid weights, duplicates, unknown constituents) and computation logic (ETF price time series, top holdings, constituent data).
- This layered structure keeps each layer focused on a single responsibility, making the backend organized and easy to scale when adding new API endpoints.


## Performance & Optimization
- **Prices are loaded once:** `prices.csv` is read at server startup and cached in memory, so uploads do not re-read `prices.csv` from disk.
- **Backend does the heavy lifting:** Server-side handles computation of weighted sums, sorting for top holdings, and data transformations, allowing the frontend to receive ready-to-render data.
- **Conditional rendering:** Visualization components only mount when valid data exists, avoiding unnecessary Recharts initialization.
- **Responsive charts:** Recharts `ResponsiveContainer` prevents hard-coded widths and avoids remounting on resize.
- **Responses (Projection):** The API returns only the fields required by the table and charts to reduce payload size and memory usage.


## Future Improvements
- **Async file loading:** Replace synchronous file reads with `fs.promises` for non-blocking startup.
- **Top-K optimization:** Replace sorting with a min-heap to compute top 5 holdings in O(n log k) instead of O(n log n).
- **Request cancellation:** Cancel in-flight uploads if a user uploads again (e.g., `AbortController` with axios).
- **Result caching:** Cache previously uploaded ETF results client-side to avoid redundant re-processing for identical uploads.
- **Server-side pagination:** For very large constituent lists, add a separate GET endpoint that accepts `skip` and `take` query parameters. When the user changes the rows per page or navigates to the next page in the table, the frontend would trigger a GET request with the updated `skip` and `take` values to retrieve only the needed slice of data from the server.
