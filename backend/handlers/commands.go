package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type Command struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Payload   string    `json:"payload,omitempty"`
	Critical  bool      `json:"critical"`
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
}

func PostCommandHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var cmd Command

		if err := c.Bind(&cmd); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
		}

		if cmd.ID == "" {
			cmd.ID = uuid.NewString()
		}
		if cmd.Timestamp.IsZero() {
			cmd.Timestamp = time.Now().UTC()
		}

		_, err := db.Exec(`
			INSERT INTO commands (id, type, payload, critical, status, timestamp)
			VALUES ($1, $2, $3, $4, $5, $6)
		`, cmd.ID, cmd.Type, cmd.Payload, cmd.Critical, cmd.Status, cmd.Timestamp)
		if err != nil {
			fmt.Printf("DB insert error: %v\n", err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to insert command")
		}

		return c.JSON(http.StatusCreated, cmd)
	}
}

type HistoricalTelemetryResponse []map[string]interface{}

func GetHistoricalTelemetryHandler(db *sql.DB) echo.HandlerFunc {
  return func(c echo.Context) error {
    rangeParam := c.QueryParam("range") 
    metricsParam := c.QueryParam("metrics")

    if rangeParam == "" || metricsParam == "" {
      return echo.NewHTTPError(http.StatusBadRequest, "Missing range or metrics query parameter")
    }

    metrics := strings.Split(metricsParam, ",")
    duration, err := time.ParseDuration(rangeParam)
    if err != nil {
      return echo.NewHTTPError(http.StatusBadRequest, "Invalid range parameter")
    }

    fromTime := time.Now().UTC().Add(-duration)

    query := `
      SELECT timestamp, metric, value
      FROM telemetry
      WHERE timestamp >= $1
      AND metric = ANY($2)
      ORDER BY timestamp ASC
    `

    rows, err := db.Query(query, fromTime, pq.Array(metrics))
    if err != nil {
      return echo.NewHTTPError(http.StatusInternalServerError, "DB query failed")
    }
    defer rows.Close()

    resultMap := map[time.Time]map[string]interface{}{}

    for rows.Next() {
      var ts time.Time
      var metric string
      var value float64

      if err := rows.Scan(&ts, &metric, &value); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "DB scan failed")
      }

      if _, ok := resultMap[ts]; !ok {
        resultMap[ts] = map[string]interface{}{
          "timestamp": ts.Format(time.RFC3339),
        }
      }
      resultMap[ts][metric] = value
    }

    var response HistoricalTelemetryResponse
    for _, v := range resultMap {
      response = append(response, v)
    }

    sort.Slice(response, func(i, j int) bool {
      return response[i]["timestamp"].(string) < response[j]["timestamp"].(string)
    })

    return c.JSON(http.StatusOK, response)
  }
}

func GetCommandHistoryHandler(db *sql.DB) echo.HandlerFunc {
  return func(c echo.Context) error {
    rows, err := db.Query(`
      SELECT id, type, payload, critical, status, timestamp
      FROM commands
      ORDER BY timestamp DESC
      LIMIT 100
    `)
    if err != nil {
      return echo.NewHTTPError(http.StatusInternalServerError, "Failed to query command history")
    }
    defer rows.Close()

    var history []Command
    for rows.Next() {
      var cmd Command
      if err := rows.Scan(&cmd.ID, &cmd.Type, &cmd.Payload, &cmd.Critical, &cmd.Status, &cmd.Timestamp); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to parse command history")
      }
      history = append(history, cmd)
    }

    return c.JSON(http.StatusOK, history)
  }
}
