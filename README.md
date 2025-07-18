# Mission Control App

This repository contains the Mission Control application, which includes both the frontend and backend code. The app provides a dashboard to monitor and control satellite telemetry data with real-time and historical data visualizations.

## Repository Structure

```
/               # Root directory
├── frontend/   # React app with UI components
├── backend/    # Go API server for telemetry & commands
└── README.md
```

## Getting Started

To set up and run the application, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   ```

2. Follow setup instructions for each part:

   - **Frontend:**
     Navigate to the `frontend/` folder and follow the [frontend README](./frontend/README.md).

   - **Backend:**
     Navigate to the `backend/` folder and follow the [backend README](./backend/README.md).

## Documentation

Each subdirectory (`frontend/`, `backend/`) includes its own `README.md` with detailed instructions for installation, configuration, and development.

## Overview

- **Frontend:** React + TypeScript + TailwindCSS + ShadCN UI for mission control panels.
- **Backend:** Go server providing REST APIs and WebSocket support.
- **Database:** PostgreSQL (see backend setup).

## Requirements

- Node.js (for frontend)
- Go 1.20+ (for backend)

## Features

- Real-time telemetry updates
- Historical telemetry visualizations
- Drag & drop widget layout system
- Command history and critical command validation
- **Available Widgets:**
- Telemetry Panel
- Power Status Panel
- Temperature Panel
- Command History Panel
- Historical Telemetry Panel
- Reset Payload Command
- Activate Payload Command
- Adjust Thermal Control Command
- Adjust Antenna Orientation Command
- Schedule System Reboot Command

## 📝 License

MIT License - see LICENSE file for details.
