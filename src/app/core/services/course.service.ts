import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, StreamKeyResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/v1/courses';
  private mediaUrl = 'http://localhost:8080/api/v1/media';

  constructor(private http: HttpClient) {}

  getCourses(category?: string): Observable<Course[]> {
    let params = new HttpParams();
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }
    return this.http.get<Course[]>(this.apiUrl, { params });
  }

  getCourseBySlug(slug: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${slug}`);
  }

  getProtectedStreamToken(streamKeyId: string): Observable<StreamKeyResponse> {
    return this.http.get<StreamKeyResponse>(`${this.mediaUrl}/stream/key/${streamKeyId}`);
  }
}
