export interface Evaluation {
  id: number;
  bookingId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  instructorId: number;
  instructorName: string;
  examType: string;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallScore: number;
  detailedFeedback: string;
  strengths?: string;
  areasForImprovement?: string;
  examinerRecommendation?: string;
  certificateCode: string;
  evaluatedAt: string;
}

export interface EvaluationGradePayload {
  bookingId: number;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  detailedFeedback: string;
  strengths?: string;
  areasForImprovement?: string;
  examinerRecommendation?: string;
}
