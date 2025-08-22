"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Navigation, Satellite, MapPin } from "lucide-react"
import RealGPSTracker from "./real-gps-tracker"
import DriverDashboard from "./driver-dashboard"

export default function EnhancedDriverDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [locationData, setLocationData] = useState(null)
  const [gpsEnabled, setGpsEnabled] = useState(false)

  const driverInfo = {
    busId: "MH-12-AB-1234",
    driverId: "driver_001",
    name: "Rajesh Kumar",
  }

  const handleLocationUpdate = (location) => {
    setLocationData(location)
    setGpsEnabled(true)
    console.log("Driver received GPS update:", location)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 hover:bg-green-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Enhanced Driver Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {driverInfo.name} • {driverInfo.busId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={gpsEnabled ? "default" : "secondary"} className={gpsEnabled ? "bg-green-500" : ""}>
                <Satellite className="h-3 w-3 mr-1" />
                {gpsEnabled ? "GPS Active" : "GPS Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Navigation className="h-4 w-4 mr-2" />
              Driver Dashboard
            </TabsTrigger>
            <TabsTrigger value="gps" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Satellite className="h-4 w-4 mr-2" />
              Real GPS Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DriverDashboard onBack={() => {}} />
          </TabsContent>

          <TabsContent value="gps">
            <RealGPSTracker
              busId={driverInfo.busId}
              driverId={driverInfo.driverId}
              onLocationUpdate={handleLocationUpdate}
            />
          </TabsContent>
        </Tabs>

        {/* Current Location Display */}
        {locationData && (
          <Card className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MapPin className="h-5 w-5 mr-2" />
                Live GPS Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-100">Coordinates:</span>
                  <div className="font-mono font-medium">
                    {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <span className="text-green-100">Accuracy:</span>
                  <div className="font-medium">±{Math.round(locationData.accuracy)}m</div>
                </div>
                <div>
                  <span className="text-green-100">Speed:</span>
                  <div className="font-medium">
                    {locationData.speed ? `${Math.round(locationData.speed * 3.6)} km/h` : "0 km/h"}
                  </div>
                </div>
                <div>
                  <span className="text-green-100">Last Update:</span>
                  <div className="font-medium">{new Date(locationData.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
