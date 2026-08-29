export interface CourseLesson {
  id: number;
  moduleTitle: string;
  lessonTitle: string;
  durationMinutes: number;
  videoHlsUrl: string;
  streamKeyId: string;
  lessonOrder: number;
  freePreview: boolean;
  summary: string;
  worksheetPdfKey?: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  category: 'IELTS' | 'PTE' | 'SPOKEN_ENGLISH';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  price: number;
  rating: number;
  totalReviews: number;
  totalHours: number;
  totalLessons: number;
  instructorName: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
  streamKeyId: string;
  lessons?: CourseLesson[];
}

export interface StreamKeyResponse {
  streamKeyId: string;
  playbackToken: string;
  hlsStreamUrl: string;
  watermarkedUserEmail: string;
  watermarkedUserId: string;
  tokenExpiry: string;
}
