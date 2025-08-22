"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Satellite, Navigation, AlertTriangle, CheckCircle, Wifi, WifiOff, Battery, Signal } from "lucide-react"
import { realGPS } from "../services/real-gps-integration"

export default function RealGPSTracker({ busId, driverId, onLocationUpdate }) {
  const [gpsStatus, setGpsStatus] = useState({
    isTracking: false,
    hasPermission: false,
    lastPosition: null,
    accuracy: 0,
    satelliteCount: 0,
    error: null,
  })

  const [connectionStatus, setConnectionStatus] = useState({
    online: navigator.onLine,
    serverConnected: true,
    batteryLevel: 100,
  })

  const [trackingStats, setTrackingStats] = useState({
    totalUpdates: 0,
    averageAccuracy: 0,
    lastUpdateTime: null,
    offlineQueueSize: 0,
  })

  // Initialize GPS service
  useEffect(() => {
    const handleLocationUpdate = (locationData) => {
      if (locationData.error) {
        setGpsStatus((prev) => ({ ...prev, error: locationData.error }))
        return
      }

      setGpsStatus((prev) => ({
        ...prev,
        lastPosition: locationData,
        accuracy: locationData.accuracy,
        error: null,
      }))

      setTrackingStats((prev) => ({
        ...prev,
        totalUpdates: prev.totalUpdates + 1,
        lastUpdateTime: new Date().toLocaleTimeString(),
        averageAccuracy: Math.round((prev.averageAccuracy + locationData.accuracy) / 2),
      }))

      // Call parent callback
      if (onLocationUpdate) {
        onLocationUpdate(locationData)
      }
    }

    realGPS.addLocationCallback(handleLocationUpdate)

    return () => {
      realGPS.removeLocationCallback(handleLocationUpdate)
    }
  }, [onLocationUpdate])

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus((prev) => ({ ...prev, online: true }))
    const handleOffline = () => setConnectionStatus((prev) => ({ ...prev, online: false }))

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Simulate battery monitoring
    const batteryInterval = setInterval(() => {
      setConnectionStatus((prev) => ({
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - 0.1),
      }))
    }, 60000) // Update every minute

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(batteryInterval)
    }
  }, [])

  // Start GPS tracking
  const handleStartTracking = async () => {
    try {
      setGpsStatus((prev) => ({ ...prev, error: null }))
      await realGPS.startTracking(busId, driverId)
      setGpsStatus((prev) => ({
        ...prev,
        isTracking: true,
        hasPermission: true,
      }))
    } catch (error) {
      setGpsStatus((prev) => ({
        ...prev,
        error: error.message,
        hasPermission: false,
      }))
    }
  }

  // Stop GPS tracking
  const handleStopTracking = () => {
    realGPS.stopTracking()
    setGpsStatus((prev) => ({ ...prev, isTracking: false }))
  }

  // Sync offline data
  const handleSyncOffline = async () => {
    try {
      await realGPS.syncOfflineData()
      setTrackingStats((prev) => ({ ...prev, offlineQueueSize: 0 }))
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }

  const getAccuracyColor = (accuracy) => {
    if (accuracy <= 5) return "text-green-600"
    if (accuracy <= 15) return "text-yellow-600"
    return "text-red-600"
  }

  const getAccuracyLevel = (accuracy) => {
    if (accuracy <= 5) return "Excellent"
    if (accuracy <= 15) return "Good"
    if (accuracy <= 50) return "Fair"
    return "Poor"
  }

  return (
    <div className="space-y-6">
      {/* GPS Status Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Satellite className="h-5 w-5 mr-2 text-blue-600" />
              Real GPS Tracker
            </span>
            <Badge
              variant={gpsStatus.isTracking ? "default" : "secondary"}
              className={gpsStatus.isTracking ? "bg-green-500 animate-pulse" : ""}
            >
              {gpsStatus.isTracking ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Control Buttons */}
          <div className="flex space-x-2">
            {!gpsStatus.isTracking ? (
              <Button onClick={handleStartTracking} className="flex-1 bg-green-600 hover:bg-green-700">
                <Navigation className="h-4 w-4 mr-2" />
                Start Real GPS Tracking
              </Button>
            ) : (
              <Button onClick={handleStopTracking} variant="outline" className="flex-1 bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}

            <Button onClick={handleSyncOffline} variant="outline" disabled={!connectionStatus.online}>
              Sync Offline Data
            </Button>
          </div>

          {/* Error Display */}
          {gpsStatus.error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>GPS Error:</strong> {gpsStatus.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Position */}
          {gpsStatus.lastPosition && (
            <div className="bg-white/80 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                Current Location
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Latitude:</span>
                  <div className="font-mono font-medium">{gpsStatus.lastPosition.latitude.toFixed(6)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Longitude:</span>
                  <div className="font-mono font-medium">{gpsStatus.lastPosition.longitude.toFixed(6)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Accuracy:</span>
                  <div className={`font-medium ${getAccuracyColor(gpsStatus.accuracy)}`}>
                    ±{Math.round(gpsStatus.accuracy)}m ({getAccuracyLevel(gpsStatus.accuracy)})
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Speed:</span>
                  <div className="font-medium">
                    {gpsStatus.lastPosition.speed ? `${Math.round(gpsStatus.lastPosition.speed * 3.6)} km/h` : "0 km/h"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Signal className="h-5 w-5 mr-2" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {connectionStatus.online ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="text-sm font-medium">{connectionStatus.online ? "Online" : "Offline"}</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Battery className="h-5 w-5 text-gray-600" />
                <span className="text-xs ml-1">{Math.round(connectionStatus.batteryLevel)}%</span>
              </div>
              <div className="text-sm font-medium">Battery</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {connectionStatus.serverConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="text-sm font-medium">Server</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{trackingStats.totalUpdates}</div>
              <div className="text-sm text-blue-800">Total Updates</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{trackingStats.averageAccuracy}m</div>
              <div className="text-sm text-green-800">Avg Accuracy</div>
            </div>
          </div>

          {trackingStats.lastUpdateTime && (
            <div className="text-sm text-gray-600 text-center">Last Update: {trackingStats.lastUpdateTime}</div>
          )}

          {trackingStats.offlineQueueSize > 0 && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {trackingStats.offlineQueueSize} location updates pending sync
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* GPS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>GPS Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">High Accuracy Mode:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Enabled
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Update Timeout:</span>
              <span className="font-medium">10 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maximum Age:</span>
              <span className="font-medium">5 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Offline Storage:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Enabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
