"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Bus,
  Users,
  MapPin,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Search,
  Download,
  Eye,
  Phone,
  MessageSquare,
  Settings,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboard({ onBack }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBus, setSelectedBus] = useState(null)
  const [isAddingBus, setIsAddingBus] = useState(false)
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [isAddingRoute, setIsAddingRoute] = useState(false)

  const [buses, setBuses] = useState([
    {
      id: 1,
      number: "MH-12-AB-1234",
      driver: "Rajesh Kumar",
      driverPhone: "+91 98765 43210",
      route: "Route A",
      status: "active",
      students: 25,
      lastUpdate: "2 min ago",
      speed: 35,
      fuel: 75,
    },
    {
      id: 2,
      number: "MH-12-CD-5678",
      driver: "Suresh Patil",
      driverPhone: "+91 98765 43211",
      route: "Route B",
      status: "active",
      students: 30,
      lastUpdate: "1 min ago",
      speed: 42,
      fuel: 60,
    },
    {
      id: 3,
      number: "MH-12-EF-9012",
      driver: "Amit Sharma",
      driverPhone: "+91 98765 43212",
      route: "Route C",
      status: "maintenance",
      students: 0,
      lastUpdate: "2 hours ago",
      speed: 0,
      fuel: 45,
    },
  ])

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      grade: "8A",
      rollNumber: "2024-8A-15",
      bus: "MH-12-AB-1234",
      parent: "Priya Sharma",
      phone: "+91 98765 43210",
      address: "Andheri West, Mumbai",
      status: "active",
    },
    {
      id: 2,
      name: "Diya Patel",
      grade: "7B",
      rollNumber: "2024-7B-08",
      bus: "MH-12-AB-1234",
      parent: "Ravi Patel",
      phone: "+91 98765 43211",
      address: "Lokhandwala, Mumbai",
      status: "active",
    },
    {
      id: 3,
      name: "Arjun Singh",
      grade: "9A",
      rollNumber: "2024-9A-22",
      bus: "MH-12-CD-5678",
      parent: "Meera Singh",
      phone: "+91 98765 43212",
      address: "Powai, Mumbai",
      status: "active",
    },
  ])

  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Route A",
      stops: ["Andheri Station", "Lokhandwala", "Versova", "Juhu", "Bandra"],
      duration: "45 min",
      distance: "18 km",
      students: 25,
      status: "active",
    },
    {
      id: 2,
      name: "Route B",
      stops: ["Powai", "Hiranandani", "Ghatkopar", "Kurla", "BKC"],
      duration: "50 min",
      distance: "22 km",
      students: 30,
      status: "active",
    },
    {
      id: 3,
      name: "Route C",
      stops: ["Malad", "Goregaon", "Jogeshwari", "Vile Parle", "Santacruz"],
      duration: "40 min",
      distance: "16 km",
      students: 0,
      status: "inactive",
    },
  ])

  const [newBus, setNewBus] = useState({
    number: "",
    driver: "",
    driverPhone: "",
    route: "",
  })

  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    rollNumber: "",
    parent: "",
    phone: "",
    address: "",
    bus: "",
  })

  const [newRoute, setNewRoute] = useState({
    name: "",
    stops: "",
    duration: "",
    distance: "",
  })

  const handleAddBus = () => {
    if (newBus.number && newBus.driver && newBus.route) {
      const bus = {
        id: buses.length + 1,
        number: newBus.number,
        driver: newBus.driver,
        driverPhone: newBus.driverPhone,
        route: newBus.route,
        status: "active",
        students: 0,
        lastUpdate: "Just now",
        speed: 0,
        fuel: 100,
      }
      setBuses([...buses, bus])
      setNewBus({ number: "", driver: "", driverPhone: "", route: "" })
      setIsAddingBus(false)
    }
  }

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.grade && newStudent.parent) {
      const student = {
        id: students.length + 1,
        ...newStudent,
        status: "active",
      }
      setStudents([...students, student])
      setNewStudent({ name: "", grade: "", rollNumber: "", parent: "", phone: "", address: "", bus: "" })
      setIsAddingStudent(false)
    }
  }

  const handleAddRoute = () => {
    if (newRoute.name && newRoute.stops) {
      const route = {
        id: routes.length + 1,
        name: newRoute.name,
        stops: newRoute.stops.split(",").map((s) => s.trim()),
        duration: newRoute.duration,
        distance: newRoute.distance,
        students: 0,
        status: "active",
      }
      setRoutes([...routes, route])
      setNewRoute({ name: "", stops: "", duration: "", distance: "" })
      setIsAddingRoute(false)
    }
  }

  const deleteBus = (id) => {
    setBuses(buses.filter((bus) => bus.id !== id))
  }

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id))
  }

  const deleteRoute = (id) => {
    setRoutes(routes.filter((route) => route.id !== id))
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.bus.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalStudents = students.length
  const activeBuses = buses.filter((bus) => bus.status === "active").length
  const activeRoutes = routes.filter((route) => route.status === "active").length
  const totalAlerts = 2

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "default"
      case "maintenance":
        return "secondary"
      case "inactive":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 hover:bg-purple-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">St. Mary's High School</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Users className="h-3 w-3 mr-1" />
                {totalStudents} Students
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Bus className="h-3 w-3 mr-1" />
                {activeBuses} Active Buses
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Buses</p>
                  <p className="text-3xl font-bold">{buses.length}</p>
                  <p className="text-blue-100 text-xs mt-1">{activeBuses} active</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Bus className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                  <p className="text-green-100 text-xs mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +5 this week
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Routes</p>
                  <p className="text-3xl font-bold">{activeRoutes}</p>
                  <p className="text-purple-100 text-xs mt-1">
                    <BarChart3 className="h-3 w-3 inline mr-1" />
                    85% efficiency
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Alerts</p>
                  <p className="text-3xl font-bold">{totalAlerts}</p>
                  <p className="text-orange-100 text-xs mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Last: 5 min ago
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="buses" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <TabsTrigger value="buses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Bus className="h-4 w-4 mr-2" />
              Fleet Management
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="routes" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <MapPin className="h-4 w-4 mr-2" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-2" />
              Live Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buses">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Bus Fleet Management</CardTitle>
                    <CardDescription>Manage your school bus fleet and assign drivers</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Dialog open={isAddingBus} onOpenChange={setIsAddingBus}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Bus
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Bus</DialogTitle>
                          <DialogDescription>Enter the details for the new bus</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bus-number">Bus Number</Label>
                            <Input
                              id="bus-number"
                              placeholder="MH-12-GH-3456"
                              value={newBus.number}
                              onChange={(e) => setNewBus({ ...newBus, number: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="driver-name">Driver Name</Label>
                            <Input
                              id="driver-name"
                              placeholder="Driver Name"
                              value={newBus.driver}
                              onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="driver-phone">Driver Phone</Label>
                            <Input
                              id="driver-phone"
                              placeholder="+91 98765 43213"
                              value={newBus.driverPhone}
                              onChange={(e) => setNewBus({ ...newBus, driverPhone: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="route">Route</Label>
                            <Select
                              value={newBus.route}
                              onValueChange={(value) => setNewBus({ ...newBus, route: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Route" />
                              </SelectTrigger>
                              <SelectContent>
                                {routes.map((route) => (
                                  <SelectItem key={route.id} value={route.name}>
                                    {route.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleAddBus} className="flex-1">
                              Add Bus
                            </Button>
                            <Button variant="outline" onClick={() => setIsAddingBus(false)} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buses.map((bus) => (
                    <Card key={bus.id} className="p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {bus.number.slice(-2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-lg">{bus.number}</h3>
                              <Badge
                                variant={getStatusBadge(bus.status)}
                                className={getStatusColor(bus.status) + " text-white border-0"}
                              >
                                {bus.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {bus.driver} • {bus.route}
                            </p>
                            <p className="text-xs text-gray-500">Last update: {bus.lastUpdate}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{bus.students}</div>
                            <div className="text-xs text-gray-500">Students</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{bus.speed}</div>
                            <div className="text-xs text-gray-500">km/h</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{bus.fuel}%</div>
                            <div className="text-xs text-gray-500">Fuel</div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => alert(`Calling ${bus.driver}...`)}>
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteBus(bus.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Student Management</CardTitle>
                    <CardDescription>Manage student assignments and parent contacts</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Student
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Student</DialogTitle>
                          <DialogDescription>Enter the student details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="student-name">Student Name</Label>
                            <Input
                              id="student-name"
                              placeholder="Student Name"
                              value={newStudent.name}
                              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                              id="grade"
                              placeholder="8A"
                              value={newStudent.grade}
                              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="roll-number">Roll Number</Label>
                            <Input
                              id="roll-number"
                              placeholder="2024-8A-16"
                              value={newStudent.rollNumber}
                              onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="parent-name">Parent Name</Label>
                            <Input
                              id="parent-name"
                              placeholder="Parent Name"
                              value={newStudent.parent}
                              onChange={(e) => setNewStudent({ ...newStudent, parent: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              placeholder="+91 98765 43213"
                              value={newStudent.phone}
                              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                              id="address"
                              placeholder="Student Address"
                              value={newStudent.address}
                              onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="bus-assignment">Assign Bus</Label>
                            <Select
                              value={newStudent.bus}
                              onValueChange={(value) => setNewStudent({ ...newStudent, bus: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Bus" />
                              </SelectTrigger>
                              <SelectContent>
                                {buses
                                  .filter((bus) => bus.status === "active")
                                  .map((bus) => (
                                    <SelectItem key={bus.id} value={bus.number}>
                                      {bus.number} - {bus.route}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleAddStudent} className="flex-1">
                              Add Student
                            </Button>
                            <Button variant="outline" onClick={() => setIsAddingStudent(false)} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {student.grade}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                            <p className="text-sm text-gray-600">Parent: {student.parent}</p>
                            <p className="text-xs text-gray-500">{student.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{student.bus}</div>
                            <div className="text-xs text-gray-500">{student.phone}</div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => alert(`Calling ${student.parent}...`)}>
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Route Management</CardTitle>
                    <CardDescription>Create and manage bus routes and stops</CardDescription>
                  </div>
                  <Dialog open={isAddingRoute} onOpenChange={setIsAddingRoute}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Route
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription>Create a new bus route</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="route-name">Route Name</Label>
                          <Input
                            id="route-name"
                            placeholder="Route D"
                            value={newRoute.name}
                            onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="stops">Stops (comma separated)</Label>
                          <Textarea
                            id="stops"
                            placeholder="Stop 1, Stop 2, Stop 3"
                            value={newRoute.stops}
                            onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="35 min"
                            value={newRoute.duration}
                            onChange={(e) => setNewRoute({ ...newRoute, duration: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="distance">Distance</Label>
                          <Input
                            id="distance"
                            placeholder="15 km"
                            value={newRoute.distance}
                            onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddRoute} className="flex-1">
                            Add Route
                          </Button>
                          <Button variant="outline" onClick={() => setIsAddingRoute(false)} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {routes.map((route) => (
                    <Card key={route.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{route.name}</CardTitle>
                          <Badge variant={route.status === "active" ? "default" : "secondary"}>{route.status}</Badge>
                        </div>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {route.duration}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {route.distance}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Route Stops:</p>
                            <div className="space-y-1">
                              {route.stops.map((stop, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                                  <span>{stop}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-sm text-gray-600">
                              <Users className="h-4 w-4 inline mr-1" />
                              {route.students} students
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => deleteRoute(route.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Live Bus Tracking</CardTitle>
                <CardDescription>Monitor all buses in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 overflow-hidden mb-6">
                  <img
                    src="/placeholder.svg?height=400&width=800&text=Live+Fleet+Tracking+Dashboard"
                    alt="Fleet tracking map"
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3">Active Buses</h3>
                    <div className="space-y-2">
                      {buses
                        .filter((bus) => bus.status === "active")
                        .map((bus) => (
                          <div key={bus.id} className="flex items-center text-sm">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="font-medium">{bus.number}</span>
                            <span className="text-gray-500 ml-2">({bus.route})</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{activeBuses}</div>
                      <div className="text-xs text-gray-600">Buses Online</div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Map Settings
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/90">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buses
                    .filter((bus) => bus.status === "active")
                    .map((bus) => (
                      <Card key={bus.id} className="hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">{bus.number}</p>
                              <p className="text-sm text-gray-600">{bus.driver}</p>
                              <p className="text-sm text-gray-600">{bus.route}</p>
                            </div>
                            <Badge className="bg-green-500 text-white animate-pulse">
                              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                              Live
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center mb-3">
                            <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-blue-600">{bus.students}</div>
                              <div className="text-xs text-blue-800">Students</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-green-600">{bus.speed}</div>
                              <div className="text-xs text-green-800">km/h</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-orange-600">{bus.fuel}%</div>
                              <div className="text-xs text-orange-800">Fuel</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Last Update: {bus.lastUpdate}</span>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Track
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
