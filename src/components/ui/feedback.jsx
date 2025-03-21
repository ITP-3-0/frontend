"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react"


export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    byCategory: {
      bug: 0,
      feature: 0,
      improvement: 0,
      question: 0,
      other: 0,
    },
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/feedback/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          console.warn("Stats API not available, using mock data.");
          calculateMockStats();
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        calculateMockStats();
      }
    }

    const calculateMockStats = async () => {
      try {
        // Fetch all feedbacks and calculate stats
        const response = await fetch("/api/feedback")

        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks")
        }

        const data = await response.json()
        const feedbacks = data.feedbacks || []

        // Calculate stats
        const newStats = {
          total: feedbacks.length,
          new: feedbacks.filter((f) => f.status === "new").length,
          inProgress: feedbacks.filter((f) => f.status === "inProgress").length,
          resolved: feedbacks.filter((f) => f.status === "resolved").length,
          byPriority: {
            low: feedbacks.filter((f) => f.priority === "low").length,
            medium: feedbacks.filter((f) => f.priority === "medium").length,
            high: feedbacks.filter((f) => f.priority === "high").length,
            critical: feedbacks.filter((f) => f.priority === "critical").length,
          },
          byCategory: {
            bug: feedbacks.filter((f) => f.category === "bug").length,
            feature: feedbacks.filter((f) => f.category === "feature").length,
            improvement: feedbacks.filter((f) => f.category === "improvement").length,
            question: feedbacks.filter((f) => f.category === "question").length,
            other: feedbacks.filter((f) => f.category === "other").length,
          },
        }

        setStats(newStats)
      } catch (error) {
        console.error("Error calculating mock stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Feedback submissions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.new}</div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
          <p className="text-xs text-muted-foreground">Currently being addressed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.resolved}</div>
          <p className="text-xs text-muted-foreground">Completed feedback items</p>
        </CardContent>
      </Card>
    </div>
  )
}


