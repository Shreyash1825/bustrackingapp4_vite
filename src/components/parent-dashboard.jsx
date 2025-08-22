"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, MapPin, Clock, AlertTriangle, Bus, Bell, Phone, MessageSquare, Navigation, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ParentDashboard({ onBack }) {
  const [busLocation, setBusLocation] = useState({ lat: 19.076, lng: 72.8777 })
  const [eta, setEta] = useState(12)
  const [busStatus, setBusStatus] = useState("on-route")
  const [routeProgress, setRouteProgress] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Bus started from school", time: "2:45 PM", type: "info", read: false },
    { id: 2, message: "Bus arriving in 12 minutes", time: "3:02 PM", type: "warning", read: false },
    { id: 3, message: "Traffic delay on Route A", time: "3:05 PM", type: "alert", read: true },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
      setEta((prev) => Math.max(1, prev - Math.random() * 2))
      setRouteProgress((prev) => Math.min(100, prev + Math.random() * 5))

      // Simulate status changes
      if (Math.random() > 0.95) {
        const statuses = ["on-route", "delayed", "boarding"]
        setBusStatus(statuses[Math.floor(Math.random() * statuses.length)])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const studentInfo = {
    name: "Aarav Sharma",
    grade: "8A",
    rollNumber: "2024-8A-15",
    busNumber: "MH-12-AB-1234",
    route: "Route A - Andheri to Bandra",
    pickupTime: "7:30 AM",
    dropTime: "3:00 PM",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 98765 43210",
    avatar: "/placeholder.svg?height=40&width=40&text=AS",
  }

  const handleCallDriver = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(`Calling ${studentInfo.driverName}...`)
    }, 1000)
  }

  const handleSendMessage = () => {
    alert("Message sent to driver!")
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "on-route":
        return "bg-blue-500"
      case "delayed":
        return "bg-red-500"
      case "arrived":
        return "bg-green-500"
      case "boarding":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "on-route":
        return "On Route"
      case "delayed":
        return "Delayed"
      case "arrived":
        return "Arrived"
      case "boarding":
        return "Boarding"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 hover:bg-blue-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={studentInfo.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">AS</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Parent Dashboard</h1>
                  <p className="text-sm text-gray-600">{studentInfo.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={`${getStatusColor(busStatus)} text-white border-0 animate-pulse`}>
                <Bus className="h-3 w-3 mr-1" />
                {getStatusText(busStatus)}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Zap className="h-4 w-4 mr-1 text-green-500" />
                Live
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Student Info & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Student Info Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Bus className="h-5 w-5 mr-2 text-blue-600" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={studentInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{studentInfo.name}</p>
                    <p className="text-sm text-gray-600">
                      {studentInfo.grade} • Roll: {studentInfo.rollNumber}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bus Number:</span>
                    <Badge variant="outline" className="font-mono">
                      {studentInfo.busNumber}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Route:</span>
                    <span className="text-sm font-medium text-right max-w-[150px]">{studentInfo.route}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pickup Time:</span>
                    <span className="text-sm font-medium">{studentInfo.pickupTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Drop Time:</span>
                    <span className="text-sm font-medium">{studentInfo.dropTime}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Driver:</span>
                    <span className="text-sm font-medium">{studentInfo.driverName}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCallDriver}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {isLoading ? "Calling..." : "Call"}
                    </Button>
                    <Button onClick={handleSendMessage} variant="outline" className="flex-1 bg-transparent" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ETA Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2" />
                  Estimated Arrival
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{Math.round(eta)} min</div>
                  <p className="text-blue-100 mb-4">Bus arriving at your stop</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-blue-100">
                      <span>Route Progress</span>
                      <span>{Math.round(routeProgress)}%</span>
                    </div>
                    <Progress value={routeProgress} className="bg-blue-400/30" />
                  </div>

                  <Badge variant="secondary" className="mt-4 bg-white/20 text-white border-white/30">
                    <Navigation className="h-3 w-3 mr-1" />
                    {getStatusText(busStatus)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Full Route
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Trip History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map & Notifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  Live Bus Location
                </CardTitle>
                <CardDescription>Real-time tracking of bus {studentInfo.busNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600&text=Interactive+Bus+Map+View"
                    alt="Bus location map"
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {/* Map Overlays */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="flex items-center text-sm font-medium">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      Bus Location
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Updated 2 seconds ago</div>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="text-xs text-gray-600">Speed: 35 km/h</div>
                    <div className="text-xs text-gray-600">Lat: {busLocation.lat.toFixed(4)}</div>
                    <div className="text-xs text-gray-600">Lng: {busLocation.lng.toFixed(4)}</div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">Next Stop: Versova</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">ETA: 5 minutes</div>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Navigation className="h-4 w-4 mr-2" />
                      Full Screen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-orange-500" />
                    Recent Notifications
                  </CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {notifications.filter((n) => !n.read).length} new
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Alert
                      key={notification.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        !notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <AlertTriangle
                            className={`h-4 w-4 mt-0.5 mr-3 ${
                              notification.type === "alert"
                                ? "text-red-500"
                                : notification.type === "warning"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <div>
                            <AlertDescription className="font-medium text-gray-900">
                              {notification.message}
                            </AlertDescription>
                            <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                          </div>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                      </div>
                    </Alert>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
