package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
	"github.com/mmborado/mission-control/handlers"
)



func main() {
	godotenv.Load()

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}
	
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("DB not reachable:", err)
	}

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("FRONTEND_URL")}, 
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
	}))

	e.GET("/health", func(c echo.Context) error {
		if err := db.Ping(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"status": "DB Unreachable"})
		}
		return c.JSON(http.StatusOK, map[string]string{"status": "OK"})
	})

	// Telemetry web socket data
	e.GET("ws/telemetry", telemetryWebSocketHandler);

	// Historical Telemetry data
	e.GET("/api/telemetry/historical", handlers.GetHistoricalTelemetryHandler(db))

	// Command History
	e.GET("/api/commands", handlers.GetCommandHistoryHandler(db))

	// Handle new command
	e.POST("/api/commands", handlers.PostCommandHandler(db))

	port := os.Getenv("PORT")
	fmt.Println("Server running on port", port)
	e.Logger.Fatal(e.Start(":" + port))
}
