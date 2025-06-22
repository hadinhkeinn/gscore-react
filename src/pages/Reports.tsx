import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Users, Award, BarChart3, PieChart as PieChartIcon, Activity, Target, AlertCircle } from "lucide-react"
import { scoreApi } from "@/api/score-api"
import { ScoreReportData } from "@/types/score-data"
import {Loader} from "@/components/ui/loader.tsx";



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
  total_students: {
    label: "Total Students",
    color: "hsl(217, 91%, 60%)",
  },
}

const COLORS = {
  excellent: "#16a34a",
  good: "#3b82f6",
  average: "#eab308",
  below_average: "#ef4444",
}

export default function Report() {
  const [reportData, setReportData] = useState<ScoreReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await scoreApi.getScoreReport()
        setReportData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch report data')
      } finally {
        setLoading(false)
      }
    }

      fetchReportData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <Loader size='md' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700">Error Loading Report</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reportData || !reportData.subjects || !reportData.summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>No report data available</p>
      </div>
    )
  }

  // Prepare data for different chart types
  const subjectData = reportData.subjects.map(subject => ({
    name: subject.subject_name,
    subject: subject.subject,
    excellent: subject.statistics.excellent,
    good: subject.statistics.good,
    average: subject.statistics.average,
    below_average: subject.statistics.below_average,
    total_students: subject.statistics.total_students,
    excellent_pct: ((subject.statistics.excellent / subject.statistics.total_students) * 100).toFixed(1),
    good_pct: ((subject.statistics.good / subject.statistics.total_students) * 100).toFixed(1),
    average_pct: ((subject.statistics.average / subject.statistics.total_students) * 100).toFixed(1),
    below_average_pct: ((subject.statistics.below_average / subject.statistics.total_students) * 100).toFixed(1),
  }))

  const overallDistribution = [
    { name: "Excellent", value: reportData.summary.overall_distribution.excellent, percentage: reportData.summary.percentages.excellent },
    { name: "Good", value: reportData.summary.overall_distribution.good, percentage: reportData.summary.percentages.good },
    { name: "Average", value: reportData.summary.overall_distribution.average, percentage: reportData.summary.percentages.average },
    { name: "Below Average", value: reportData.summary.overall_distribution.below_average, percentage: reportData.summary.percentages.below_average },
  ]

  const radarData = reportData.subjects.map(subject => ({
    subject: subject.subject_name.split(' ')[0], // Shortened names for radar
    excellent: (subject.statistics.excellent / subject.statistics.total_students) * 100,
    good: (subject.statistics.good / subject.statistics.total_students) * 100,
    average: (subject.statistics.average / subject.statistics.total_students) * 100,
  }))

  return (
      <div className="space-y-6 w-full min-w-0 max-w-none">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold tracking-tight">Report</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {reportData.summary.total_scores_analyzed.toLocaleString()} Total Scores
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Excellent Scores</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reportData.summary.percentages.excellent}%
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.summary.overall_distribution.excellent.toLocaleString()} students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Good Scores</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {reportData.summary.percentages.good}%
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.summary.overall_distribution.good.toLocaleString()} students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Scores</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {reportData.summary.percentages.average}%
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.summary.overall_distribution.average.toLocaleString()} students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Below Average</CardTitle>
              <Activity className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {reportData.summary.percentages.below_average}%
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.summary.overall_distribution.below_average.toLocaleString()} students
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Score Levels Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Score Level Definitions</CardTitle>
            <CardDescription>
              Understanding the performance categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="w-4 h-4 rounded bg-green-600"></div>
                <div>
                  <div className="font-medium text-green-800">Excellent</div>
                  <div className="text-sm text-green-600">{reportData.score_levels.excellent}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-4 h-4 rounded bg-blue-600"></div>
                <div>
                  <div className="font-medium text-blue-800">Good</div>
                  <div className="text-sm text-blue-600">{reportData.score_levels.good}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="w-4 h-4 rounded bg-yellow-600"></div>
                <div>
                  <div className="font-medium text-yellow-800">Average</div>
                  <div className="text-sm text-yellow-600">{reportData.score_levels.average}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <div>
                  <div className="font-medium text-red-800">Below Average</div>
                  <div className="text-sm text-red-600">{reportData.score_levels.below_average}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">

          {/* Chart 1: Stacked Bar Chart - All Performance Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Complete Performance Breakdown
              </CardTitle>
              <CardDescription>
                All performance levels by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="excellent" stackId="a" fill={COLORS.excellent} />
                  <Bar dataKey="good" stackId="a" fill={COLORS.good} />
                  <Bar dataKey="average" stackId="a" fill={COLORS.average} />
                  <Bar dataKey="below_average" stackId="a" fill={COLORS.below_average} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Overall Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Overall Score Distribution
              </CardTitle>
              <CardDescription>
                Distribution of all scores across performance levels
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
                      data={overallDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                  >
                    {overallDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 3: Subject Performance Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance by Subject
              </CardTitle>
              <CardDescription>
                Excellent scores comparison across subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="excellent" fill={COLORS.excellent} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 4: Total Students by Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Participation by Subject
              </CardTitle>
              <CardDescription>
                Total number of students per subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <AreaChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                      type="monotone"
                      dataKey="total_students"
                      stroke={COLORS.good}
                      fill={COLORS.good}
                      fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 5: Line Chart - Excellent Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Excellence Trend Across Subjects
              </CardTitle>
              <CardDescription>
                Percentage of excellent scores by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <LineChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                      type="monotone"
                      dataKey="excellent_pct"
                      stroke={COLORS.excellent}
                      strokeWidth={3}
                      dot={{ fill: COLORS.excellent, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 6: Radar Chart - Performance Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Profile Radar
              </CardTitle>
              <CardDescription>
                Multi-dimensional performance view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={10} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                      name="Excellent %"
                      dataKey="excellent"
                      stroke={COLORS.excellent}
                      fill={COLORS.excellent}
                      fillOpacity={0.3}
                  />
                  <Radar
                      name="Good %"
                      dataKey="good"
                      stroke={COLORS.good}
                      fill={COLORS.good}
                      fillOpacity={0.3}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}