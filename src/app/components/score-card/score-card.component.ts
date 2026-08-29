import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evaluation } from '../../core/models/evaluation.model';

@Component({
  selector: 'app-score-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.css']
})
export class ScoreCardComponent {
  @Input() evaluation!: Evaluation;

  get isIelts(): boolean {
    return this.evaluation?.examType?.toUpperCase().includes('IELTS') ?? true;
  }

  getPercent(score: number): number {
    if (this.isIelts) {
      return (score / 9.0) * 100;
    }
    return (score / 90.0) * 100;
  }
}
