import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../core/services/tenant.service';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  tenantService = inject(TenantService);
  courseService = inject(CourseService);

  fluencyInput = 7.5;
  lexicalInput = 7.5;
  grammarInput = 8.0;
  pronunciationInput = 8.0;

  calculatedBand = signal<number>(8.0);
  pteEquivalent = signal<number>(79);
  featuredCourses = signal<Course[]>([]);

  constructor() {
    this.calculateBand();
    this.courseService.getCourses().subscribe(courses => {
      this.featuredCourses.set(courses.slice(0, 3));
    });
  }

  calculateBand() {
    const raw = (this.fluencyInput + this.lexicalInput + this.grammarInput + this.pronunciationInput) / 4.0;
    const integerPart = Math.floor(raw);
    const frac = raw - integerPart;

    let rounded: number;
    if (frac < 0.25) {
      rounded = integerPart;
    } else if (frac < 0.75) {
      rounded = integerPart + 0.5;
    } else {
      rounded = integerPart + 1.0;
    }
    this.calculatedBand.set(rounded);

    if (rounded >= 8.5) this.pteEquivalent.set(86);
    else if (rounded >= 8.0) this.pteEquivalent.set(79);
    else if (rounded >= 7.5) this.pteEquivalent.set(73);
    else if (rounded >= 7.0) this.pteEquivalent.set(65);
    else if (rounded >= 6.5) this.pteEquivalent.set(58);
    else this.pteEquivalent.set(50);
  }
}
