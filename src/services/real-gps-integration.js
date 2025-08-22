"use client"

// Real GPS Integration Service
class RealGPSIntegration {
  constructor() {
    this.isTracking = false
    this.watchId = null
    this.lastKnownPosition = null
    this.trackingOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    }
    this.callbacks = new Set()
  }

  // Check if GPS is available
  isGPSAvailable() {
    return "geolocation" in navigator
  }

  // Request GPS permissions
  async requestPermissions() {
    if (!this.isGPSAvailable()) {
      throw new Error("GPS not available on this device")
    }

    try {
      // Request permission using the Permissions API if available
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({ name: "geolocation" })
        if (permission.state === "denied") {
          throw new Error("GPS permission denied")
        }
      }

      // Test GPS access
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("GPS permission granted")
            resolve(true)
          },
          (error) => {
            console.error("GPS permission error:", error)
            reject(new Error(`GPS Error: ${error.message}`))
          },
          this.trackingOptions,
        )
      })
    } catch (error) {
      throw new Error(`Permission request failed: ${error.message}`)
    }
  }

  // Start real-time GPS tracking
  async startTracking(busId, driverId) {
    if (this.isTracking) {
      console.log("GPS tracking already active")
      return
    }

    try {
      await this.requestPermissions()

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationData = {
            busId,
            driverId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            altitude: position.coords.altitude || 0,
            timestamp: Date.now(),
            source: "smartphone_gps",
          }

          this.lastKnownPosition = locationData
          this.notifyCallbacks(locationData)
          this.sendToServer(locationData)
        },
        (error) => {
          console.error("GPS tracking error:", error)
          this.handleGPSError(error)
        },
        this.trackingOptions,
      )

      this.isTracking = true
      console.log("Real GPS tracking started")
    } catch (error) {
      throw new Error(`Failed to start GPS tracking: ${error.message}`)
    }
  }

  // Stop GPS tracking
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
    console.log("GPS tracking stopped")
  }

  // Add callback for location updates
  addLocationCallback(callback) {
    this.callbacks.add(callback)
  }

  // Remove callback
  removeLocationCallback(callback) {
    this.callbacks.delete(callback)
  }

  // Notify all callbacks
  notifyCallbacks(locationData) {
    this.callbacks.forEach((callback) => {
      try {
        callback(locationData)
      } catch (error) {
        console.error("Callback error:", error)
      }
    })
  }

  // Send location to server
  async sendToServer(locationData) {
    try {
      const response = await fetch("/api/location-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      console.log("Location sent to server successfully")
    } catch (error) {
      console.error("Failed to send location to server:", error)
      // Store offline for later sync
      this.storeOffline(locationData)
    }
  }

  // Handle GPS errors
  handleGPSError(error) {
    let errorMessage = "Unknown GPS error"

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "GPS permission denied by user"
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = "GPS position unavailable"
        break
      case error.TIMEOUT:
        errorMessage = "GPS request timeout"
        break
    }

    console.error("GPS Error:", errorMessage)
    this.notifyCallbacks({ error: errorMessage, type: "gps_error" })
  }

  // Store location offline
  storeOffline(locationData) {
    try {
      const offlineData = JSON.parse(localStorage.getItem("offline_locations") || "[]")
      offlineData.push(locationData)

      // Keep only last 100 locations
      if (offlineData.length > 100) {
        offlineData.splice(0, offlineData.length - 100)
      }

      localStorage.setItem("offline_locations", JSON.stringify(offlineData))
    } catch (error) {
      console.error("Failed to store offline location:", error)
    }
  }

  // Sync offline data
  async syncOfflineData() {
    try {
      const offlineData = JSON.parse(localStorage.getItem("offline_locations") || "[]")

      if (offlineData.length === 0) return

      const response = await fetch("/api/location-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locations: offlineData }),
      })

      if (response.ok) {
        localStorage.removeItem("offline_locations")
        console.log(`Synced ${offlineData.length} offline locations`)
      }
    } catch (error) {
      console.error("Failed to sync offline data:", error)
    }
  }

  // Get current position once
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            altitude: position.coords.altitude || 0,
            timestamp: Date.now(),
          }
          resolve(locationData)
        },
        (error) => reject(error),
        this.trackingOptions,
      )
    })
  }

  // Get tracking status
  getStatus() {
    return {
      isTracking: this.isTracking,
      lastPosition: this.lastKnownPosition,
      watchId: this.watchId,
      callbackCount: this.callbacks.size,
    }
  }
}

// Export singleton instance
export const realGPS = new RealGPSIntegration()

// Background GPS Service Worker Integration
export class BackgroundGPSService {
  constructor() {
    this.serviceWorkerRegistration = null
  }

  // Register service worker for background GPS
  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register("/sw-gps.js")
        console.log("GPS Service Worker registered")
        return true
      } catch (error) {
        console.error("Service Worker registration failed:", error)
        return false
      }
    }
    return false
  }

  // Start background GPS tracking
  async startBackgroundTracking(busId, driverId) {
    if (!this.serviceWorkerRegistration) {
      await this.registerServiceWorker()
    }

    // Send message to service worker
    if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.active) {
      this.serviceWorkerRegistration.active.postMessage({
        type: "START_GPS_TRACKING",
        busId,
        driverId,
      })
    }
  }

  // Stop background tracking
  stopBackgroundTracking() {
    if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.active) {
      this.serviceWorkerRegistration.active.postMessage({
        type: "STOP_GPS_TRACKING",
      })
    }
  }
}

export const backgroundGPS = new BackgroundGPSService()
