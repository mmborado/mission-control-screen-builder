package main

import "database/sql"

func ensureTelemetryTable(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS telemetry (
			id SERIAL PRIMARY KEY,
			timestamp TIMESTAMPTZ NOT NULL,
			subsystem TEXT NOT NULL,
			metric TEXT NOT NULL,
			value DOUBLE PRECISION NOT NULL,
			unit TEXT NOT NULL,
			status TEXT NOT NULL
		);

		CREATE UNIQUE INDEX IF NOT EXISTS idx_telemetry_unique ON telemetry (timestamp, subsystem, metric);
	`)
	return err
}

func ensureCommandsTable(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS commands (
			id TEXT PRIMARY KEY,
			type TEXT NOT NULL,
			payload TEXT,
			critical BOOLEAN NOT NULL DEFAULT false,
			status TEXT NOT NULL,
			timestamp TIMESTAMPTZ NOT NULL
		)
	`)
	return err
}
