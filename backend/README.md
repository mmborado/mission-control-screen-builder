# Mission Control Backend

This is the backend API for the Mission Control app, built with Go and PostgreSQL.

---

## Full Setup Instructions (No Docker)

### Prerequisites

Make sure the following are installed:

- [Go](https://go.dev/dl/) (version 1.18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/mmborado/mission-control-screen-builder.git
cd mission-control-screen-builder
cd backend
```

---

### Step 2: Configure Environment Variables

For this demo, you can use the included `.env` file.

The `.env` file should have the following variables (update with your actual database credentials):

```env
PORT=8080
DATABASE_URL=postgres://missioncontrol:yourpassword@localhost:5432/missioncontrol_demo?sslmode=disable
FRONTEND_URL=http://localhost:5173
```

> Replace `yourpassword` with your actual PostgreSQL password.

---

### Step 3: Install Go Dependencies

Run this command to download required Go modules:

```bash
go mod download
```

---

### Step 4: Start PostgreSQL Server

Ensure PostgreSQL is installed and running:

- On **Linux/macOS**, you can start it with:

  ```bash
  sudo service postgresql start
  ```

  or

  ```bash
  brew services start postgresql
  ```

- On **Windows**, start PostgreSQL from the Services app or via pgAdmin.

---

### Step 5: Create the Database

Create the database used by the app:

```bash
createdb missioncontrol_demo
```

---

### Step 6 Create a PostgreSQL User

```bash
createuser missioncontrol --pwprompt
```

Then update your `.env` file password accordingly:

```env
DATABASE_URL=postgres://missioncontrol:yourpassword@localhost:5432/missioncontrol_demo?sslmode=disable
```

---

### Step 7: Seed the Database (Demo Data)

Run the seed command to populate the database with demo data:

```bash
go run ./cmd/seed
```

This step ensures your app has initial data for testing.

---

### Step 8: Run the Backend Server

Run the Go backend:

```bash
go run main.go telemetry.go websocket.go
```

You should see:

```
Server running on port 8080
```

---

### Step 9: Verify Server Health

Test the health endpoint to verify the server and database are working:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{ "status": "OK" }
```

---

## API Endpoints

| Endpoint                    | HTTP Method | Description                         |
| --------------------------- | ----------- | ----------------------------------- |
| `/health`                   | GET         | Returns status of server and DB     |
| `/ws/telemetry`             | GET         | WebSocket stream for telemetry data |
| `/api/telemetry/historical` | GET         | Get historical telemetry records    |
| `/api/commands`             | GET         | Fetch all command history           |
| `/api/commands`             | POST        | Submit a new command                |

---

## Troubleshooting

- **Failed to connect to DB:**

  - Make sure PostgreSQL is running.
  - Verify your `.env` `DATABASE_URL` is correct (user, password, host, port, database name).
  - Confirm the database exists (`createdb missioncontrol_demo`).

- **Port already in use:**

  - Change the `PORT` value in your `.env` file to a free port.

- **Go command not found or errors running Go:**

  - Ensure Go is installed and your environment variables (`$GOPATH`, `$PATH`) include Go binaries.

- **`createdb` or `createuser` commands not found:**
  - Make sure PostgreSQL is installed properly and its bin directory is added to your system PATH.

---

## License

MIT License

---

## Contact

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

Thank you for trying out the Mission Control Backend!
