# Mission Control Frontend

This is the frontend for the Mission Control app, built with React, TypeScript, and Vite. It provides a draggable, grid-based interface for managing telemetry data and issuing commands to the backend API.

---

## 🚀 Full Setup Instructions

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/mmborado/mission-control-screen-builder.git
cd frontend
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory (or use the included one for demo):

```env
VITE_API_BASE=http://localhost:8080
```

> `VITE_API_BASE` should point to your running backend API.

---

### Step 3: Install Dependencies

Use npm (or yarn/pnpm):

```bash
npm install
# OR
yarn install
# OR
pnpm install
```

---

### Step 4: Start the Development Server

Run the dev server:

```bash
npm run dev
```

This will start the app at [http://localhost:5173](http://localhost:5173) by default.

---

## 🧑‍💻 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint on the codebase           |

---

## 🌐 API Configuration

The frontend expects the backend API to be available at the URL set in `VITE_API_BASE`. Example for local development:

```
VITE_API_BASE=http://localhost:8080
```

---

## 🗂 Folder Structure

```
mission-control-frontend/
├── public/                  # Static assets
│   └── vite.svg
├── src/                     # Source code
│   ├── assets/              # Images and icons
│   ├── components/          # UI and layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and API client
│   ├── store/               # Zustand stores for app state
│   ├── types/               # TypeScript types
│   ├── widgets/             # Draggable widgets for the grid
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite environment types
├── .env                     # Environment variables
├── package.json             # Project metadata and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

---

## 🛠 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query/)
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)
- [Recharts](https://recharts.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🐞 Troubleshooting

- **API errors (CORS, 404, etc.):**
  - Ensure your backend is running and accessible at the URL in `VITE_API_BASE`.
- **Port conflict on 5173:**
  - Change the port in `vite.config.ts` or run with `vite --port 3000`.
- **Styles not loading:**
  - Make sure Tailwind is properly configured and PostCSS is installed.

---

## 📜 License

MIT License

---

## 🙋 Contact

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

Thank you for using Mission Control Frontend!
