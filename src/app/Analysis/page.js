"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertTriangle, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-2">
        <div className="p-2 bg-gray-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">System Feedback Analysis</h1>
      <p className="text-gray-500 mb-8">Monitor and analyze system feedback in real-time.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,853</div>
            <p className="text-sm text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
            <ThumbsUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,926</div>
            <p className="text-sm text-green-600">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Negative Feedback</CardTitle>
            <ThumbsDown className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">621</div>
            <p className="text-sm text-red-600">-4.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Neutral Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">306</div>
            <p className="text-sm text-gray-500">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-red-600">-12 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Feedback Trends</CardTitle>
          <p className="text-sm text-gray-500">Visualize feedback patterns over time</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                Daily Chart
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                Weekly Chart
              </div>
            </TabsContent>
            <TabsContent value="monthly">
              <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                Monthly Chart
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
