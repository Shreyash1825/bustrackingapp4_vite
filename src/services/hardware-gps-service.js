// Hardware GPS Tracker Integration (JavaScript version)

class HardwareGPSService {
  constructor() {
    this.deviceConnections = new Map()
    this.isConnected = false
  }

  // Integrate with Traccar (open-source GPS tracking platform)
  async connectToTraccar(serverUrl, deviceId) {
    try {
      const ws = new WebSocket(`${serverUrl}/api/socket`)

      ws.onopen = () => {
        console.log(`Connected to Traccar server for device ${deviceId}`)
        this.isConnected = true
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.processHardwareGPSData(data)
      }

      ws.onclose = () => {
        console.log(`Disconnected from Traccar server for device ${deviceId}`)
        this.isConnected = false
        // Attempt reconnection after 5 seconds
        setTimeout(() => this.connectToTraccar(serverUrl, deviceId), 5000)
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      this.deviceConnections.set(deviceId, ws)
    } catch (error) {
      console.error("Failed to connect to Traccar:", error)
    }
  }

  // Process incoming GPS data from hardware
  processHardwareGPSData(data) {
    // Convert to your app's format and broadcast
    const locationUpdate = {
      busId: this.getBusIdFromDevice(data.deviceId),
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      heading: data.heading,
      accuracy: this.calculateAccuracy(data.satellites),
      timestamp: new Date(data.timestamp).getTime(),
      eventType: data.eventType || "position",
    }

    // Broadcast to parents and admin
    this.broadcastUpdate(locationUpdate)
  }

  // Get bus ID from device ID mapping
  getBusIdFromDevice(deviceId) {
    // This would typically come from your database
    const deviceToBusMapping = {
      device_001: "MH-12-AB-1234",
      device_002: "MH-12-CD-5678",
      device_003: "MH-12-EF-9012",
    }
    return deviceToBusMapping[deviceId] || "unknown"
  }

  // Calculate accuracy based on satellite count
  calculateAccuracy(satellites) {
    if (satellites >= 8) return 3 // Excellent
    if (satellites >= 6) return 5 // Good
    if (satellites >= 4) return 10 // Fair
    return 20 // Poor
  }

  // Broadcast update to all connected clients
  async broadcastUpdate(locationUpdate) {
    try {
      // Send to your API endpoint
      const response = await fetch("/api/location-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationUpdate),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      console.log(`Location update broadcasted for bus ${locationUpdate.busId}`)
    } catch (error) {
      console.error("Failed to broadcast location update:", error)
    }
  }

  // Disconnect from all devices
  disconnectAll() {
    this.deviceConnections.forEach((ws, deviceId) => {
      ws.close()
      console.log(`Disconnected from device ${deviceId}`)
    })
    this.deviceConnections.clear()
    this.isConnected = false
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connectedDevices: Array.from(this.deviceConnections.keys()),
    }
  }
}

// Hybrid GPS Tracker (combines smartphone and hardware GPS)
class HybridGPSTracker {
  constructor() {
    this.hardwareTracker = new HardwareGPSService()
    this.phoneTracker = null // Will be initialized with GPSService
    this.primarySource = "hardware"
    this.fallbackActive = false
  }

  // Initialize with phone GPS service
  initialize(phoneGPSService) {
    this.phoneTracker = phoneGPSService
    this.setupFallbackLogic()
  }

  // Setup automatic fallback logic
  setupFallbackLogic() {
    // Monitor hardware GPS connection
    setInterval(() => {
      const hardwareStatus = this.hardwareTracker.getConnectionStatus()

      if (!hardwareStatus.isConnected && !this.fallbackActive) {
        console.log("Hardware GPS disconnected, switching to phone GPS")
        this.primarySource = "phone"
        this.fallbackActive = true
        this.startPhoneTracking()
      } else if (hardwareStatus.isConnected && this.fallbackActive) {
        console.log("Hardware GPS reconnected, switching back")
        this.primarySource = "hardware"
        this.fallbackActive = false
        this.stopPhoneTracking()
      }
    }, 10000) // Check every 10 seconds
  }

  // Start phone GPS tracking
  startPhoneTracking() {
    if (this.phoneTracker) {
      // Implementation depends on your phone GPS service
      console.log("Starting phone GPS tracking as fallback")
    }
  }

  // Stop phone GPS tracking
  stopPhoneTracking() {
    if (this.phoneTracker) {
      // Implementation depends on your phone GPS service
      console.log("Stopping phone GPS tracking")
    }
  }

  // Get current tracking status
  getTrackingStatus() {
    return {
      primarySource: this.primarySource,
      fallbackActive: this.fallbackActive,
      hardwareConnected: this.hardwareTracker.getConnectionStatus().isConnected,
    }
  }
}

// Security and Privacy utilities
class SecureGPSService {
  constructor(encryptionKey) {
    this.encryptionKey = encryptionKey
  }

  // Encrypt location data (requires crypto library)
  encryptLocation(location) {
    try {
      // Note: You'll need to install and import a crypto library like crypto-js
      // const CryptoJS = require('crypto-js')
      // return CryptoJS.AES.encrypt(JSON.stringify(location), this.encryptionKey).toString()

      // For demo purposes, just return base64 encoded
      return btoa(JSON.stringify(location))
    } catch (error) {
      console.error("Failed to encrypt location:", error)
      return JSON.stringify(location)
    }
  }

  // Decrypt location data
  decryptLocation(encryptedLocation) {
    try {
      // const CryptoJS = require('crypto-js')
      // const bytes = CryptoJS.AES.decrypt(encryptedLocation, this.encryptionKey)
      // return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

      // For demo purposes, decode base64
      return JSON.parse(atob(encryptedLocation))
    } catch (error) {
      console.error("Failed to decrypt location:", error)
      return null
    }
  }

  // Add noise to location for privacy (when not actively tracking)
  anonymizeLocation(location) {
    return {
      ...location,
      latitude: location.latitude + (Math.random() - 0.5) * 0.001,
      longitude: location.longitude + (Math.random() - 0.5) * 0.001,
    }
  }

  // Validate location data
  validateLocation(location) {
    if (!location || typeof location !== "object") return false
    if (typeof location.latitude !== "number" || typeof location.longitude !== "number") return false
    if (Math.abs(location.latitude) > 90 || Math.abs(location.longitude) > 180) return false
    return true
  }
}

// Export all services
export { HardwareGPSService, HybridGPSTracker, SecureGPSService }
