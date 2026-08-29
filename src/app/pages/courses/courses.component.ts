import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courseService = inject(CourseService);
  marketplaceService = inject(MarketplaceService);
  route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  selectedCategory = signal<string>('ALL');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      this.loadCourses();
    });
  }

  filterCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses(this.selectedCategory()).subscribe(res => {
      this.courses.set(res);
    });
  }

  enroll(course: Course) {
    this.marketplaceService.addToCart({
      itemType: 'COURSE',
      referenceId: course.id,
      itemTitle: course.title,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl
    });
  }
}
