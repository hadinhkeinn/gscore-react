import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, BookOpen, Globe, Atom, FlaskConical, Dna, Clock, MapPin, Scale } from "lucide-react"
import { ApiError } from "@/lib/api"
import {ScoreData} from "@/types/score-data.ts";
import {scoreApi} from "@/api/score-api.ts";

export default function SearchScores() {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!registrationNumber.trim()) {
      setError("Please enter a registration number")
      return
    }

    setIsLoading(true)
    setError("")
    setScoreData(null)

    try {
      const data = await scoreApi.getScore(registrationNumber)
      setScoreData(data)
    } catch (error) {
      console.error("Error fetching score data:", error)
      
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      math: BookOpen,
      literature: BookOpen,
      foreign_lang: Globe,
      physics: Atom,
      chemistry: FlaskConical,
      biology: Dna,
      history: Clock,
      geography: MapPin,
      civic_education: Scale
    }
    return icons[subject] || BookOpen
  }

  const getSubjectName = (subject: string) => {
    const names: Record<string, string> = {
      math: "Mathematics",
      literature: "Literature",
      foreign_lang: "Foreign Language",
      physics: "Physics",
      chemistry: "Chemistry",
      biology: "Biology",
      history: "History",
      geography: "Geography",
      civic_education: "Civic Education"
    }
    return names[subject] || subject
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400"
    if (score >= 8) return "text-green-600"
    if (score >= 6.5) return "text-blue-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-400"
    if (score >= 8) return "bg-green-100 text-green-800"
    if (score >= 6.5) return "bg-blue-100 text-blue-800"
    if (score >= 5) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6 w-full min-w-0 max-w-none">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold tracking-tight">Search Scores</h1>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Student Score Lookup
          </CardTitle>
          <CardDescription>
            Enter a registration number to search for student scores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter registration number here..."
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {scoreData && (
        <div className="space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                  <p className="text-lg font-semibold">{scoreData.r_number}</p>
                </div>
                {scoreData.foreign_lang_code && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Foreign Language Code</label>
                    <p className="text-lg font-semibold">{scoreData.foreign_lang_code}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scores Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(scoreData)
              .filter(([key]) => !['r_number', 'foreign_lang_code'].includes(key))
              .map(([subject, score]) => {
                const Icon = getSubjectIcon(subject)
                return (
                  <Card key={subject} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {getSubjectName(subject)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                            {score !== null ? score.toFixed(2) : "N/A"}
                          </div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(score)}`}>
                            {score !== null ? (
                              score >= 8 ? "Excellent" :
                              score >= 6.5 ? "Good" :
                              score >= 5 ? "Average" : "Below Average"
                            ) : "Not Taken"}
                          </div>
                        </div>
                        {score !== null && (
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Score</div>
                            <div className="text-sm font-medium">/ 10.0</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Score Summary</CardTitle>
              <CardDescription>
                Overview of all available scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(scoreData).filter(score => typeof score === 'number').length}
                  </div>
                  <div className="text-sm text-blue-600">Subjects Taken</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(scoreData)
                      .filter(score => typeof score === 'number' && score >= 5)
                      .length}
                  </div>
                  <div className="text-sm text-green-600">Passed Subjects</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(() => {
                      const scores = Object.values(scoreData).filter(score => typeof score === 'number') as number[]
                      return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : "N/A"
                    })()}
                  </div>
                  <div className="text-sm text-purple-600">Average Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}