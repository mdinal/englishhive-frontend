import { Component, Input, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-protected-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protected-video-player.component.html',
  styleUrls: ['./protected-video-player.component.css']
})
export class ProtectedVideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoUrl: string = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  @Input() lessonTitle: string = 'Lesson Preview';

  authService = inject(AuthService);

  watermarkX = signal<number>(30);
  watermarkY = signal<number>(25);

  private intervalId: any;

  get userWatermarkText(): string {
    const user = this.authService.currentUser();
    const email = user?.email || 'guest@englishhive.com';
    const id = user?.id ? `ID:STU-${user.id}` : 'CAMPUS-PREVIEW';
    const time = new Date().toISOString().substring(11, 19);
    return `${email} • ${id} • ${time}`;
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      const newX = Math.floor(Math.random() * 70) + 15;
      const newY = Math.floor(Math.random() * 70) + 15;
      this.watermarkX.set(newX);
      this.watermarkY.set(newY);
    }, 4000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  preventRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  onPlay() {}

  onPause() {}
}
