export interface ScoreData {
    r_number: string
    math: number | null
    literature: number | null
    foreign_lang: number | null
    physics: number | null
    chemistry: number | null
    biology: number | null
    history: number | null
    geography: number | null
    civic_education: number | null
    foreign_lang_code: string | null
}

// Report-related types
interface SubjectStatistics {
    excellent: number
    good: number
    average: number
    below_average: number
    total_students: number
}
interface SubjectReport {
    subject: string
    subject_name: string
    statistics: SubjectStatistics
}

interface OverallDistribution {
    excellent: number
    good: number
    average: number
    below_average: number
}

interface PercentageDistribution {
    excellent: number
    good: number
    average: number
    below_average: number
}

interface ReportSummary {
    total_scores_analyzed: number
    overall_distribution: OverallDistribution
    percentages: PercentageDistribution
}

interface ScoreLevels {
    excellent: string
    good: string
    average: string
    below_average: string
}

export interface ScoreReportData {
    subjects: SubjectReport[]
    summary: ReportSummary
    score_levels: ScoreLevels
}

export interface Student {
    r_number: string
    subject_scores: {
        math: number
        physics: number
        chemistry: number
    }
    total_score: number
    average_score: number
    subjects_count: number
    foreign_lang_code: string
    rank: number
}

export interface TopStudentResponse {
    top_students: Student[]
    summary: {
        total_group_a_students: number
        top_students_count: number
        all_students_stats: {
            highest_total: number
            lowest_total: number
            average_total: number
            average_score_mean: number
        }
        top_students_stats: {
            highest_total: number
            lowest_total: number
            average_total: number
            average_score_mean: number
        }
    }
    criteria: {
        group: string
        subjects: string[]
        ranking_method: string
        minimum_subjects: number
        limit: number
    }
}