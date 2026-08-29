import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { ToastService } from '../../core/services/toast.service';
import { Course, CourseLesson } from '../../core/models/course.model';
import { ProtectedVideoPlayerComponent } from '../../components/protected-video-player/protected-video-player.component';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProtectedVideoPlayerComponent],
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit {
  route = inject(ActivatedRoute);
  courseService = inject(CourseService);
  toast = inject(ToastService);

  course = signal<Course | null>(null);
  activeLesson = signal<CourseLesson | null>(null);
  studentNotes = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.courseService.getCourseBySlug(slug).subscribe(course => {
          this.course.set(course);
          if (course.lessons && course.lessons.length > 0) {
            this.activeLesson.set(course.lessons[0]);
          }
          this.loadNotes(slug);
        });
      }
    });
  }

  selectLesson(lesson: CourseLesson) {
    this.activeLesson.set(lesson);
  }

  downloadWorksheet() {
    this.toast.success('Worksheet Download', 'Official British Council practice worksheet downloaded.');
  }

  private loadNotes(slug: string) {
    const saved = localStorage.getItem('notes_' + slug);
    if (saved) this.studentNotes = saved;
  }

  saveNotes() {
    const course = this.course();
    if (course) {
      localStorage.setItem('notes_' + course.slug, this.studentNotes);
    }
  }
}
