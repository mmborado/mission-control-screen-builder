package main

import (
	"math/rand"
	"time"
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
func generateMockTelemetry() []Telemetry {
	
	now := time.Now().UTC().Format(time.RFC3339)

	drain := 0.5 + rand.Float64()*1.5
	batteryLevel -= drain
	if batteryLevel < 10 {
			batteryLevel = 100 
	}

	batteryStatus := "nominal"
	if batteryLevel < 30 {
		batteryStatus = "warning"
	} else if batteryLevel < 15 {
		batteryStatus = "critical"
	}

	batteryVoltage := 14.3 + rand.Float64()*0.4 
	solarInput := 60 + rand.Float64()*40        
	consumption := 70 + rand.Float64()*30       
	cpuTemp := 38 + rand.Float64()*12           
	signalStrength := 60 + rand.Float64()*30    

	thermalStatus := "nominal"
	if cpuTemp > 48 {
		thermalStatus = "warning"
	} else if cpuTemp > 52 {
		thermalStatus = "critical"
	}

	signalStatus := "nominal"
	if signalStrength < 65 {
		signalStatus = "warning"
	} else if signalStrength < 50 {
		signalStatus = "critical"
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
