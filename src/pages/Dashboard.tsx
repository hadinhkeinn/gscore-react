import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Search, 
  Award, 
  Activity,
  AlertCircle,
  BookOpen,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"
import { scoreApi } from "@/api/score-api"
import { ScoreReportData, TopStudentResponse } from "@/types/score-data"
import { Loader } from "@/components/ui/loader"

// Chart configurations
const chartConfig = {
  excellent: {
    label: "Excellent",
    color: "hsl(142, 76%, 36%)",
  },
  good: {
    label: "Good", 
    color: "hsl(213, 94%, 68%)",
  },
  average: {
    label: "Average",
    color: "hsl(45, 93%, 47%)",
  },
  below_average: {
    label: "Below Average",
    color: "hsl(0, 84%, 60%)",
  },
}

const COLORS = {
  excellent: "#16a34a",
  good: "#3b82f6", 
  average: "#eab308",
  below_average: "#ef4444",
}

interface DashboardStats {
  totalScores: number
  averageScore: number
  topPerformers: number
  recentActivity: number
  trend: {
    totalScores: 'up' | 'down' | 'neutral'
    averageScore: 'up' | 'down' | 'neutral'
    topPerformers: 'up' | 'down' | 'neutral'
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState<ScoreReportData | null>(null)
  const [topStudentsData, setTopStudentsData] = useState<TopStudentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch both report data and top students data
        const [reportResponse, topStudentsResponse] = await Promise.all([
          scoreApi.getScoreReport(),
          scoreApi.getTopStudents()
        ])
        
        setReportData(reportResponse)
        setTopStudentsData(topStudentsResponse)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader size="lg" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-700 mb-1">Error Loading Dashboard</h3>
              <p className="text-sm text-red-600">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reportData || !topStudentsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <p>No dashboard data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate dashboard statistics
  const dashboardStats: DashboardStats = {
    totalScores: reportData.summary.total_scores_analyzed,
    averageScore: topStudentsData.summary.all_students_stats.average_score_mean,
    topPerformers: reportData.summary.overall_distribution.excellent,
    recentActivity: topStudentsData.summary.top_students_count,
    trend: {
      totalScores: 'up', // Mock trend data - in real app this would come from API
      averageScore: 'up',
      topPerformers: 'up'
    }
  }

  // Prepare chart data
  const performanceDistribution = [
    { name: "Excellent", value: reportData.summary.overall_distribution.excellent, percentage: reportData.summary.percentages.excellent },
    { name: "Good", value: reportData.summary.overall_distribution.good, percentage: reportData.summary.percentages.good },
    { name: "Average", value: reportData.summary.overall_distribution.average, percentage: reportData.summary.percentages.average },
    { name: "Below Average", value: reportData.summary.overall_distribution.below_average, percentage: reportData.summary.percentages.below_average },
  ]

  const topSubjects = reportData.subjects
    .map(subject => ({
      name: subject.subject_name.split(' ')[0], // Shortened name
      excellent: subject.statistics.excellent,
      total: subject.statistics.total_students,
      percentage: ((subject.statistics.excellent / subject.statistics.total_students) * 100).toFixed(1)
    }))
    .sort((a, b) => b.excellent - a.excellent)
    .slice(0, 5)

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8 w-full min-w-0 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your scores today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <Button onClick={() => navigate('/reports')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Scores</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {dashboardStats.totalScores.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon(dashboardStats.trend.totalScores)}
              <p className={`text-sm font-medium ${getTrendColor(dashboardStats.trend.totalScores)}`}>
                +12% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Average Score</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {dashboardStats.averageScore.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon(dashboardStats.trend.averageScore)}
              <p className={`text-sm font-medium ${getTrendColor(dashboardStats.trend.averageScore)}`}>
                +2.1% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Top Performers</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {dashboardStats.topPerformers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon(dashboardStats.trend.topPerformers)}
              <p className={`text-sm font-medium ${getTrendColor(dashboardStats.trend.topPerformers)}`}>
                +8% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Students</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {topStudentsData.summary.total_group_a_students.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-600">
                +5% from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Performance Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Performance Distribution
            </CardTitle>
            <CardDescription>
              Overall score distribution across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
              onClick={() => navigate('/search-scores')}
            >
              <Search className="mr-3 h-5 w-5" />
              Search Scores
            </Button>
            <Button 
              className="w-full justify-start h-12" 
              variant="outline"
              onClick={() => navigate('/reports')}
            >
              <FileText className="mr-3 h-5 w-5" />
              Generate Report
            </Button>
            <Button 
              className="w-full justify-start h-12" 
              variant="outline"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              View Analytics
            </Button>
            <Button className="w-full justify-start h-12" variant="outline">
              <Users className="mr-3 h-5 w-5" />
              Manage Students
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Top Performing Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Top Performing Subjects
            </CardTitle>
            <CardDescription>
              Subjects with highest excellent scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[250px]">
              <BarChart data={topSubjects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="excellent" fill={COLORS.excellent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Recent Highlights
            </CardTitle>
            <CardDescription>
              Key achievements and statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Excellent Performers</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {reportData.summary.percentages.excellent}% of all students
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {reportData.summary.overall_distribution.excellent.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Highest Average</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Top students group
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {topStudentsData.summary.top_students_stats.average_score_mean.toFixed(1)}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-200">Total Students</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Group A participants
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {topStudentsData.summary.total_group_a_students.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}