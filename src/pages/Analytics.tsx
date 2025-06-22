import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, PieChart, Activity, Trophy, Medal, Award } from "lucide-react"
import { useState, useEffect } from "react"
import {Loader} from "@/components/ui/loader.tsx";
import {Student, TopStudentResponse} from "@/types/score-data.ts";
import {scoreApi} from "@/api/score-api.ts";

export default function Analytics() {
  const [topStudents, setTopStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<TopStudentResponse['summary'] | null>(null)

  const fetchTopStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await scoreApi.getTopStudents()
      setTopStudents(response.top_students)
      setSummary(response.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopStudents()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
    }
  }
  return (
    <div className="space-y-6 w-full min-w-0 max-w-none">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold tracking-tight">Analytics - Group A Top Students</h1>
        <Button onClick={fetchTopStudents} disabled={loading}>
          <Activity className="mr-2 h-4 w-4" />
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Students Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? summary.top_students_stats.average_score_mean.toFixed(2) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average score of top 10
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Total Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? summary.top_students_stats.highest_total : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Best performance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Group A Students</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? summary.total_group_a_students.toLocaleString() : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Students in Group A
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? summary.all_students_stats.average_score_mean.toFixed(2) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              All students average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 10 Students - Group A
          </CardTitle>
          <CardDescription>
            Highest performing students in Mathematics, Physics, and Chemistry
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader size='md' />
                </div>
              </div>
          ) : topStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Rank</th>
                    <th className="text-left p-3 font-semibold">Student ID</th>
                    <th className="text-left p-3 font-semibold">Mathematics</th>
                    <th className="text-left p-3 font-semibold">Physics</th>
                    <th className="text-left p-3 font-semibold">Chemistry</th>
                    <th className="text-left p-3 font-semibold">Total Score</th>
                    <th className="text-left p-3 font-semibold">Average</th>
                    <th className="text-left p-3 font-semibold">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {topStudents.map((student) => (
                    <tr 
                      key={student.r_number} 
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getRankIcon(student.rank)}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-sm">{student.r_number}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.subject_scores.math}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {student.subject_scores.physics}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {student.subject_scores.chemistry}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-lg">{student.total_score}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{student.average_score.toFixed(2)}</span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {student.foreign_lang_code}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}