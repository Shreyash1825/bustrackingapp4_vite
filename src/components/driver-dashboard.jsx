"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Play,
  Square,
  AlertTriangle,
  MapPin,
  Navigation,
  Fuel,
  Zap,
  CheckCircle,
  Circle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function DriverDashboard({ onBack }) {
  const [isTracking, setIsTracking] = useState(false)
  const [tripTime, setTripTime] = useState(0)
  const [studentsOnBoard, setStudentsOnBoard] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [fuelLevel, setFuelLevel] = useState(75)
  const [sosPressed, setSosPressed] = useState(false)
  const [autoUpdates, setAutoUpdates] = useState(true)

  useEffect(() => {
    let interval
    if (isTracking) {
      interval = setInterval(() => {
        setTripTime((prev) => prev + 1)
        setCurrentSpeed(Math.floor(Math.random() * 40) + 20)
        setFuelLevel((prev) => Math.max(0, prev - 0.01))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking])

  const handleStartTrip = () => {
    setIsTracking(true)
    setTripTime(0)
    setStudentsOnBoard(12)
    setCurrentSpeed(25)
  }

  const handleStopTrip = () => {
    setIsTracking(false)
    setStudentsOnBoard(0)
    setCurrentSpeed(0)
  }

  const handleSOS = () => {
    setSosPressed(true)
    setTimeout(() => setSosPressed(false), 3000)
    alert("🚨 SOS Alert sent to admin and all parents!")
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const driverInfo = {
    name: "Rajesh Kumar",
    id: "DRV001",
    busNumber: "MH-12-AB-1234",
    route: "Route A - Andheri to Bandra",
    license: "MH1234567890",
    experience: "8 years",
    rating: 4.8,
    avatar: "/placeholder.svg?height=40&width=40&text=RK",
  }

  const routeStops = [
    { name: "Andheri Station", status: "completed", time: "7:30 AM", students: 5 },
    { name: "Lokhandwala Complex", status: "completed", time: "7:45 AM", students: 3 },
    { name: "Versova Metro", status: "current", time: "8:00 AM", students: 4 },
    { name: "Juhu Beach Road", status: "pending", time: "8:15 AM", students: 6 },
    { name: "Bandra West Station", status: "pending", time: "8:30 AM", students: 8 },
  ]

  const completedStops = routeStops.filter((stop) => stop.status === "completed").length
  const totalStops = routeStops.length
  const routeProgress = (completedStops / totalStops) * 100

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
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={driverInfo.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-green-100 text-green-600">RK</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
                  <p className="text-sm text-gray-600">{driverInfo.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant={isTracking ? "default" : "secondary"}
                className={isTracking ? "bg-green-500 animate-pulse" : ""}
              >
                {isTracking ? "Trip Active" : "Trip Inactive"}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Zap className="h-4 w-4 mr-1 text-green-500" />
                {isTracking ? "Live" : "Offline"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Driver Info & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Driver Profile */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Driver Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={driverInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-green-100 text-green-600 font-semibold">RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{driverInfo.name}</p>
                    <p className="text-sm text-gray-600">ID: {driverInfo.id}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">{"★".repeat(Math.floor(driverInfo.rating))}</div>
                      <span className="text-sm text-gray-600 ml-1">{driverInfo.rating}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bus Number:</span>
                    <Badge variant="outline" className="font-mono">
                      {driverInfo.busNumber}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">License:</span>
                    <span className="text-sm font-medium">{driverInfo.license}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experience:</span>
                    <span className="text-sm font-medium">{driverInfo.experience}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Controls */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-white">Trip Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{formatTime(tripTime)}</div>
                  <p className="text-blue-100">Trip Duration</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-2xl font-bold">{currentSpeed}</div>
                    <div className="text-xs text-blue-100">km/h</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-2xl font-bold">{studentsOnBoard}</div>
                    <div className="text-xs text-blue-100">Students</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isTracking ? (
                    <Button
                      onClick={handleStartTrip}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Trip
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopTrip}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      End Trip
                    </Button>
                  )}
                </div>

                <Button
                  onClick={handleSOS}
                  className={`w-full font-bold text-lg py-3 ${
                    sosPressed ? "bg-red-700 animate-pulse" : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                  disabled={sosPressed}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {sosPressed ? "SOS SENT!" : "Emergency SOS"}
                </Button>
              </CardContent>
            </Card>

            {/* Vehicle Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Fuel className="h-5 w-5 mr-2 text-orange-500" />
                  Vehicle Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fuel Level:</span>
                    <span className="text-sm font-medium">{Math.round(fuelLevel)}%</span>
                  </div>
                  <Progress value={fuelLevel} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto Updates:</span>
                  <Switch checked={autoUpdates} onCheckedChange={setAutoUpdates} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-green-50 rounded-lg p-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-green-800">Engine OK</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-green-800">GPS Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Route & Navigation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    Route Progress
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {completedStops}/{totalStops} stops
                  </Badge>
                </div>
                <CardDescription>Track your progress along {driverInfo.route}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Route Progress</span>
                    <span>{Math.round(routeProgress)}% Complete</span>
                  </div>
                  <Progress value={routeProgress} className="h-3" />
                </div>

                <div className="space-y-4">
                  {routeStops.map((stop, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {stop.status === "completed" ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : stop.status === "current" ? (
                          <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span
                              className={`font-medium ${
                                stop.status === "current"
                                  ? "text-blue-600"
                                  : stop.status === "completed"
                                    ? "text-green-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {stop.name}
                            </span>
                            {stop.status === "current" && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">📍 Currently at this stop</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">{stop.time}</span>
                            <div className="text-xs text-gray-400">{stop.students} students</div>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={
                          stop.status === "completed" ? "default" : stop.status === "current" ? "secondary" : "outline"
                        }
                        className={
                          stop.status === "completed"
                            ? "bg-green-500"
                            : stop.status === "current"
                              ? "bg-blue-500 text-white"
                              : ""
                        }
                      >
                        {stop.status === "completed" ? "✓ Done" : stop.status === "current" ? "Current" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Map */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-purple-500" />
                  Navigation & Route Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl h-80 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=320&width=600&text=Interactive+Route+Navigation"
                    alt="Navigation map"
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {/* Map Overlays */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="flex items-center text-sm font-medium">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Your Location
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Speed: {currentSpeed} km/h</div>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="text-xs text-gray-600">Next: Juhu Beach Road</div>
                    <div className="text-xs text-gray-600">ETA: 8 minutes</div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <MapPin className="h-4 w-4 mr-2" />
                      Recenter
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/90">
                      <Navigation className="h-4 w-4 mr-2" />
                      Turn-by-Turn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Alert */}
        {isTracking && (
          <Alert className="mt-6 bg-green-50 border-green-200">
            <Zap className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Trip is active!</strong> GPS tracking enabled. Parents are receiving real-time updates. Drive
              safely! 🚌
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
