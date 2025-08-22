"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, WifiOff, Battery, Signal } from "lucide-react"

export default function GPSTracker({ busId, driverId, onLocationUpdate }) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [accuracy, setAccuracy] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [signalStrength, setSignalStrength] = useState(4)

  // GPS tracking configuration
  const GPS_CONFIG = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000,
    updateInterval: 3000, // Update every 3 seconds
  }

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsTracking(true)

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: Date.now(),
        }
        setCurrentPosition(gpsPosition)
        setAccuracy(position.coords.accuracy)
        onLocationUpdate(gpsPosition)
      },
      (error) => {
        console.error("Error getting initial position:", error)
        alert("Unable to get your location. Please check GPS permissions.")
      },
      GPS_CONFIG,
    )

    // Start continuous tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const gpsPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: Date.now(),
        }
        setCurrentPosition(gpsPosition)
        setAccuracy(position.coords.accuracy)
        onLocationUpdate(gpsPosition)
      },
      (error) => {
        console.error("GPS tracking error:", error)
      },
      GPS_CONFIG,
    )

    // Store watchId for cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  // Stop GPS tracking
  const stopTracking = () => {
    setIsTracking(false)
    setCurrentPosition(null)
  }

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Simulate battery and signal monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate battery drain
      setBatteryLevel((prev) => Math.max(0, prev - 0.1))
      // Simulate signal strength changes
      setSignalStrength(Math.floor(Math.random() * 5))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getAccuracyColor = (accuracy) => {
    if (accuracy <= 5) return "text-green-600"
    if (accuracy <= 15) return "text-yellow-600"
    return "text-red-600"
  }

  const getSignalBars = (strength) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`w-1 h-3 ${i < strength ? "bg-green-500" : "bg-gray-300"} rounded-sm`} />
    ))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            GPS Tracker
          </span>
          <Badge variant={isTracking ? "default" : "secondary"}>{isTracking ? "Active" : "Inactive"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            </div>
            <div className="text-xs text-gray-600">{isOnline ? "Online" : "Offline"}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Battery className="h-4 w-4 text-gray-600" />
              <span className="text-xs ml-1">{Math.round(batteryLevel)}%</span>
            </div>
            <div className="text-xs text-gray-600">Battery</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 space-x-0.5">
              <Signal className="h-4 w-4 text-gray-600 mr-1" />
              {getSignalBars(signalStrength)}
            </div>
            <div className="text-xs text-gray-600">Signal</div>
          </div>
        </div>

        {/* Current Position */}
        {currentPosition && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium mb-2">Current Location:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Lat: {currentPosition.latitude.toFixed(6)}</div>
              <div>Lng: {currentPosition.longitude.toFixed(6)}</div>
              <div className={getAccuracyColor(accuracy)}>Accuracy: ±{Math.round(accuracy)}m</div>
              {currentPosition.speed && <div>Speed: {Math.round(currentPosition.speed * 3.6)} km/h</div>}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-2">
          {!isTracking ? (
            <Button onClick={startTracking} className="flex-1">
              Start Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="outline" className="flex-1 bg-transparent">
              Stop Tracking
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          Updates every {GPS_CONFIG.updateInterval / 1000} seconds
        </div>
      </CardContent>
    </Card>
  )
}
