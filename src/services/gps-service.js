"use client"

class GPSService {
  constructor(config) {
    this.config = config
    this.offlineQueue = []
    this.isOnline = navigator.onLine
    this.setupOfflineHandling()
  }

  // Send location update to server
  async sendLocationUpdate(locationData) {
    try {
      if (!this.isOnline && this.config.offlineStorage) {
        // Store offline for later sync
        this.offlineQueue.push(locationData)
        this.saveOfflineData()
        return true
      }

      const response = await fetch(`${this.config.apiEndpoint}/location-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(locationData),
      })

      if (response.ok) {
        // If online and successful, try to sync offline data
        if (this.offlineQueue.length > 0) {
          await this.syncOfflineData()
        }
        return true
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Failed to send location update:", error)

      // Store offline if enabled
      if (this.config.offlineStorage) {
        this.offlineQueue.push(locationData)
        this.saveOfflineData()
      }

      return false
    }
  }

  // Sync offline data when connection is restored
  async syncOfflineData() {
    if (this.offlineQueue.length === 0) return

    try {
      const response = await fetch(`${this.config.apiEndpoint}/location-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ locations: this.offlineQueue }),
      })

      if (response.ok) {
        this.offlineQueue = []
        this.clearOfflineData()
        console.log("Offline data synced successfully")
      }
    } catch (error) {
      console.error("Failed to sync offline data:", error)
    }
  }

  // Setup offline handling
  setupOfflineHandling() {
    window.addEventListener("online", () => {
      this.isOnline = true
      this.syncOfflineData()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })

    // Load offline data on startup
    this.loadOfflineData()
  }

  // Save offline data to localStorage
  saveOfflineData() {
    try {
      localStorage.setItem("gps_offline_queue", JSON.stringify(this.offlineQueue))
    } catch (error) {
      console.error("Failed to save offline data:", error)
    }
  }

  // Load offline data from localStorage
  loadOfflineData() {
    try {
      const data = localStorage.getItem("gps_offline_queue")
      if (data) {
        this.offlineQueue = JSON.parse(data)
      }
    } catch (error) {
      console.error("Failed to load offline data:", error)
    }
  }

  // Clear offline data
  clearOfflineData() {
    try {
      localStorage.removeItem("gps_offline_queue")
    } catch (error) {
      console.error("Failed to clear offline data:", error)
    }
  }

  // Get authentication token
  getAuthToken() {
    // Implement your authentication logic here
    return localStorage.getItem("auth_token") || ""
  }

  // Get offline queue status
  getOfflineQueueStatus() {
    return {
      count: this.offlineQueue.length,
      oldestTimestamp: this.offlineQueue.length > 0 ? this.offlineQueue[0].timestamp : null,
    }
  }
}

// Export singleton instance
export const gpsService = new GPSService({
  apiEndpoint: process.env.NEXT_PUBLIC_API_URL || "https://api.schooltracker.com",
  updateInterval: 3000,
  offlineStorage: true,
})

// Background GPS tracking with service worker
export class BackgroundGPSTracker {
  constructor() {
    this.watchId = null
    this.isTracking = false
  }

  async startBackgroundTracking(busId, driverId) {
    if (!navigator.geolocation) {
      throw new Error("Geolocation not supported")
    }

    // Request persistent notification permission for background tracking
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    // Start tracking
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          busId,
          driverId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: Date.now(),
        }

        gpsService.sendLocationUpdate(locationData)
      },
      (error) => {
        console.error("Background GPS error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      },
    )

    this.isTracking = true
  }

  stopBackgroundTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
  }

  isCurrentlyTracking() {
    return this.isTracking
  }
}

export const backgroundTracker = new BackgroundGPSTracker()
