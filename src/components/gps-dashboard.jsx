"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Smartphone, HardDrive, Shield } from "lucide-react"
import GPSTracker from "./gps-tracker"
import { gpsService } from "../services/gps-service"

export default function GPSDashboard({ busId = "MH-12-AB-1234", driverId = "driver_001" }) {
  const [trackingMethod, setTrackingMethod] = useState("smartphone") // smartphone, hardware, hybrid
  const [locationHistory, setLocationHistory] = useState([])
  const [connectionStatus, setConnectionStatus] = useState({
    smartphone: false,
    hardware: false,
    server: true,
  })

  // Handle location updates from GPS tracker
  const handleLocationUpdate = async (position) => {
    console.log("New GPS position:", position)

    // Add to history
    setLocationHistory((prev) => [...prev.slice(-50), position]) // Keep last 50 positions

    // Send to server
    const locationData = {
      busId,
      driverId,
      ...position,
    }

    const success = await gpsService.sendLocationUpdate(locationData)
    setConnectionStatus((prev) => ({ ...prev, server: success }))
  }

  // Simulate hardware GPS connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus((prev) => ({
        ...prev,
        hardware: Math.random() > 0.1, // 90% uptime simulation
        smartphone: navigator.onLine,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMethodIcon = (method) => {
    switch (method) {
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "hardware":
        return <HardDrive className="h-4 w-4" />
      case "hybrid":
        return <Shield className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getStatusColor = (isConnected) => {
    return isConnected ? "bg-green-500" : "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* GPS Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            GPS Tracking Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={trackingMethod === "smartphone" ? "default" : "outline"}
              onClick={() => setTrackingMethod("smartphone")}
              className="flex flex-col items-center p-4 h-auto"
            >
              <Smartphone className="h-6 w-6 mb-2" />
              <span>Smartphone GPS</span>
              <span className="text-xs text-gray-500">Free, Easy Setup</span>
            </Button>

            <Button
              variant={trackingMethod === "hardware" ? "default" : "outline"}
              onClick={() => setTrackingMethod("hardware")}
              className="flex flex-col items-center p-4 h-auto"
            >
              <HardDrive className="h-6 w-6 mb-2" />
              <span>Hardware GPS</span>
              <span className="text-xs text-gray-500">High Accuracy</span>
            </Button>

            <Button
              variant={trackingMethod === "hybrid" ? "default" : "outline"}
              onClick={() => setTrackingMethod("hybrid")}
              className="flex flex-col items-center p-4 h-auto"
            >
              <Shield className="h-6 w-6 mb-2" />
              <span>Hybrid Mode</span>
              <span className="text-xs text-gray-500">Best Reliability</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus.smartphone)}`} />
              <span className="text-sm">Smartphone GPS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus.hardware)}`} />
              <span className="text-sm">Hardware GPS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus.server)}`} />
              <span className="text-sm">Server Connection</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPS Tracker Component */}
      {trackingMethod === "smartphone" && (
        <GPSTracker busId={busId} driverId={driverId} onLocationUpdate={handleLocationUpdate} />
      )}

      {/* Location History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Location History</span>
            <Badge variant="outline">{locationHistory.length} points</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {locationHistory
              .slice(-10)
              .reverse()
              .map((location, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-mono">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="text-gray-500">{new Date(location.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            {locationHistory.length === 0 && (
              <div className="text-center text-gray-500 py-4">No location data yet. Start tracking to see updates.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GPS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>GPS Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Update Interval:</span>
              <span className="ml-2 text-gray-600">3 seconds</span>
            </div>
            <div>
              <span className="font-medium">High Accuracy:</span>
              <span className="ml-2 text-gray-600">Enabled</span>
            </div>
            <div>
              <span className="font-medium">Offline Storage:</span>
              <span className="ml-2 text-gray-600">Enabled</span>
            </div>
            <div>
              <span className="font-medium">Encryption:</span>
              <span className="ml-2 text-gray-600">AES-256</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Offline Queue:</span>
              <Badge variant="outline">{gpsService.getOfflineQueueStatus().count} pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
