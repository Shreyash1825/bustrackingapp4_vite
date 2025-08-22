import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Users, MapPin, Shield, ArrowRight, Star, CheckCircle } from "lucide-react"
import ParentDashboard from "@/components/parent-dashboard"
import DriverDashboard from "@/components/driver-dashboard"
import AdminDashboard from "@/components/admin-dashboard"

export default function HomePage() {
  const [userRole, setUserRole] = useState(null)

  // 👉 Render dashboards if a role is set
  if (userRole === "parent") {
    return <ParentDashboard onLogout={() => setUserRole(null)} />
  }
  if (userRole === "driver") {
    return <DriverDashboard onLogout={() => setUserRole(null)} />
  }
  if (userRole === "admin") {
    return <AdminDashboard onLogout={() => setUserRole(null)} />
  }

  // 👉 Otherwise show landing page with role selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Bus className="h-16 w-16 text-blue-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SchoolTracker
                </h1>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">Trusted by 500+ schools</span>
                </div>
              </div>
            </div>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Real-time GPS tracking for school buses. Keep parents informed, drivers connected, and administrators in
              complete control.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-100 text-green-800">
                ✨ Live Tracking
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800">
                📱 Instant Alerts
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-100 text-purple-800">
                🚨 Emergency SOS
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-orange-100 text-orange-800">
                📊 Analytics
              </Badge>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Parent */}
            <Card
              className="group hover-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => setUserRole("parent")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl w-fit group-hover-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Parent Portal</CardTitle>
                <CardDescription className="text-gray-600">Track your child's bus journey in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <Button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-xl">
                  Access Parent Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Driver */}
            <Card
              className="group hover-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => setUserRole("driver")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl w-fit group-hover-110 transition-transform duration-300">
                  <Bus className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Driver App</CardTitle>
                <CardDescription className="text-gray-600">Simple and intuitive interface for drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-xl">
                  Access Driver App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Admin */}
            <Card
              className="group hover-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => setUserRole("admin")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl w-fit group-hover-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Admin Panel</CardTitle>
                <CardDescription className="text-gray-600">Complete control over your fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-3 rounded-xl">
                  Access Admin Panel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
