package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Telemetry struct {
	Timestamp string  `json:"timestamp"`
	Subsystem string  `json:"subsystem"`
	Metric    string  `json:"metric"`
	Value     float64 `json:"value"`
	Unit      string  `json:"unit"`
	Status    string  `json:"status"`
}

var batteryLevel float64 = 100

func generateMockTelemetryWithTime(now string, r *rand.Rand) []Telemetry {
	drain := 0.5 + r.Float64()*1.5
	batteryLevel -= drain
	if batteryLevel < 10 {
		batteryLevel = 100
	}

	batteryStatus := "nominal"
	if batteryLevel < 15 {
		batteryStatus = "critical"
	} else if batteryLevel < 30 {
		batteryStatus = "warning"
	}

	batteryVoltage := 14.3 + r.Float64()*0.4
	solarInput := 60 + r.Float64()*40
	consumption := 70 + r.Float64()*30
	cpuTemp := 38 + r.Float64()*12
	signalStrength := 60 + r.Float64()*30

	thermalStatus := "nominal"
	if cpuTemp > 52 {
		thermalStatus = "critical"
	} else if cpuTemp > 48 {
		thermalStatus = "warning"
	}

	signalStatus := "nominal"
	if signalStrength < 50 {
		signalStatus = "critical"
	} else if signalStrength < 65 {
		signalStatus = "warning"
	}

	if r.Float64() < 0.01 {
		cpuTemp *= 1.3
		thermalStatus = "warning"
	}

	return []Telemetry{
		{
			Timestamp: now,
			Subsystem: "power",
			Metric:    "battery_voltage",
			Value:     roundToOneDecimal(batteryVoltage),
			Unit:      "V",
			Status:    "nominal",
		},
		{
			Timestamp: now,
			Subsystem: "power",
			Metric:    "battery",
			Value:     roundToOneDecimal(batteryLevel),
			Unit:      "%",
			Status:    batteryStatus,
		},
		{
			Timestamp: now,
			Subsystem: "power",
			Metric:    "solar_input",
			Value:     roundToOneDecimal(solarInput),
			Unit:      "W",
			Status:    "nominal",
		},
		{
			Timestamp: now,
			Subsystem: "power",
			Metric:    "consumption",
			Value:     roundToOneDecimal(consumption),
			Unit:      "W",
			Status:    "nominal",
		},
		{
			Timestamp: now,
			Subsystem: "thermal",
			Metric:    "cpu_temp",
			Value:     roundToOneDecimal(cpuTemp),
			Unit:      "°C",
			Status:    thermalStatus,
		},
		{
			Timestamp: now,
			Subsystem: "comms",
			Metric:    "signal_strength",
			Value:     roundToOneDecimal(signalStrength),
			Unit:      "%",
			Status:    signalStatus,
		},
	}
}

func roundToOneDecimal(val float64) float64 {
	return float64(int(val*10+0.5)) / 10
}

func seedTelemetry(db *sql.DB) error {
	start := time.Now().Add(-7 * 24 * time.Hour)
	interval := time.Minute

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
		INSERT INTO telemetry (timestamp, subsystem, metric, value, unit, status)
		VALUES ($1, $2, $3, $4, $5, $6)
	`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	batteryLevel = 100
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	for t := start; t.Before(time.Now()); t = t.Add(interval) {
		now := t.UTC().Format(time.RFC3339)
		points := generateMockTelemetryWithTime(now, r)

		for _, p := range points {
			_, err := stmt.Exec(p.Timestamp, p.Subsystem, p.Metric, p.Value, p.Unit, p.Status)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}

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

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found, falling back to system env vars")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatalf("Failed to fetch DATABASE_URL variable")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer db.Close()


	err = ensureTelemetryTable(db)
	if err != nil {
		log.Fatalf("Failed to create telemetry table: %v", err)
	}

	err = ensureCommandsTable(db);
	if err != nil {
		log.Fatalf("Failed to ensure commands table: %v", err)
	}

	err = seedTelemetry(db)
	if err != nil {
		log.Fatalf("Seeding failed: %v", err)
	}

	fmt.Println("Telemetry data seeded successfully123.")
}
