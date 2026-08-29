import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Course, StreamKeyResponse } from '../models/course.model';
import { environment } from '../../../environments/environment';

export const DEFAULT_COURSES: Course[] = [
  {
    id: 1,
    title: 'IELTS Academic Speaking Band 8.5 Masterclass',
    slug: 'ielts-academic-speaking-8-5',
    category: 'IELTS',
    level: 'ADVANCED',
    description: 'Master the 4 examiner criteria: Fluency & Coherence, Lexical Resource, Grammatical Range, and Pronunciation with British Council examiner strategies.',
    price: 49.99,
    rating: 4.95,
    totalReviews: 342,
    totalHours: 12.5,
    totalLessons: 12,
    instructorName: 'Dr. Arthur Pendelton',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamKeyId: 'stream-key-ielts-85',
    lessons: [
      {
        id: 101,
        moduleTitle: 'Module 1: The 4 Criteria',
        lessonTitle: '01. Decoding the 4 IELTS Band Descriptors',
        durationMinutes: 15,
        videoHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        streamKeyId: 'key-101',
        lessonOrder: 1,
        freePreview: true,
        summary: 'Deep-dive into how examiners calculate your Band score across Fluency, Lexical Resource, Grammar, and Pronunciation.'
      },
      {
        id: 102,
        moduleTitle: 'Module 1: The 4 Criteria',
        lessonTitle: '02. Part 1: Eliminating Hesitation & Filler Words',
        durationMinutes: 20,
        videoHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamKeyId: 'key-102',
        lessonOrder: 2,
        freePreview: false,
        summary: 'Techniques for structured spontaneous answers without awkward pauses or robotic memorized phrases.'
      },
      {
        id: 103,
        moduleTitle: 'Module 2: Long Turn Mastery',
        lessonTitle: '03. Part 2: The 1-Minute Note-Taking Grid Formula',
        durationMinutes: 18,
        videoHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        streamKeyId: 'key-103',
        lessonOrder: 3,
        freePreview: false,
        summary: 'A bulletproof 4-quadrant system to turn 1 minute of preparation into a seamless 2-minute speech.'
      }
    ]
  },
  {
    id: 2,
    title: 'PTE Academic 79+ Speaking & Pronunciation Mastery',
    slug: 'pte-academic-79-speaking-mastery',
    category: 'PTE',
    level: 'ADVANCED',
    description: 'AI speech scoring algorithm strategies for Read Aloud, Repeat Sentence, Describe Image, and Retell Lecture with maximum acoustic clarity.',
    price: 44.99,
    rating: 4.88,
    totalReviews: 215,
    totalHours: 10.0,
    totalLessons: 10,
    instructorName: 'Prof. Helen Rostova',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamKeyId: 'stream-key-pte-79',
    lessons: [
      {
        id: 201,
        moduleTitle: 'Module 1: Acoustic Algorithms',
        lessonTitle: '01. How Pearson AI Evaluates Oral Fluency',
        durationMinutes: 14,
        videoHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamKeyId: 'key-201',
        lessonOrder: 1,
        freePreview: true,
        summary: 'Understanding acoustic analysis, pause penalties, and pitch uniformity.'
      }
    ]
  },
  {
    id: 3,
    title: 'Executive Workplace & C-Suite English Communication',
    slug: 'executive-workplace-english',
    category: 'SPOKEN_ENGLISH',
    level: 'INTERMEDIATE',
    description: 'High-stakes boardroom presentations, global team negotiations, crisis communication phrasing, and executive diplomacy.',
    price: 59.99,
    rating: 4.92,
    totalReviews: 180,
    totalHours: 8.0,
    totalLessons: 8,
    instructorName: 'Robert Sterling, MBA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamKeyId: 'stream-key-biz-eng',
    lessons: [
      {
        id: 301,
        moduleTitle: 'Module 1: Boardroom Authority',
        lessonTitle: '01. Framing Strategic Value in Board Meetings',
        durationMinutes: 15,
        videoHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        streamKeyId: 'key-301',
        lessonOrder: 1,
        freePreview: true,
        summary: 'Executive phrasing for pitching proposals and defending budgets.'
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;
  private mediaUrl = `${environment.apiUrl}/media`;

  constructor(private http: HttpClient) {}

  getCourses(category?: string): Observable<Course[]> {
    let params = new HttpParams();
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }
    return this.http.get<Course[]>(this.apiUrl, { params }).pipe(
      catchError(() => {
        if (category && category !== 'ALL') {
          return of(DEFAULT_COURSES.filter(c => c.category === category));
        }
        return of(DEFAULT_COURSES);
      })
    );
  }

  getCourseBySlug(slug: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${slug}`).pipe(
      catchError(() => {
        const found = DEFAULT_COURSES.find(c => c.slug === slug) || DEFAULT_COURSES[0];
        return of(found);
      })
    );
  }

  getProtectedStreamToken(streamKeyId: string): Observable<StreamKeyResponse> {
    return this.http.get<StreamKeyResponse>(`${this.mediaUrl}/stream/key/${streamKeyId}`).pipe(
      catchError(() => {
        const fallbackToken: StreamKeyResponse = {
          streamKeyId: streamKeyId,
          playbackToken: `hls-aes128-token-${Date.now()}`,
          hlsStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          watermarkedUserEmail: 'sarah.jenkins@oxford-prep.edu',
          watermarkedUserId: 'STU-1',
          tokenExpiry: new Date(Date.now() + 3600000).toISOString()
        };
        return of(fallbackToken);
      })
    );
  }
}
