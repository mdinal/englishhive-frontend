import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../core/services/tenant.service';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';

declare const THREE: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: false }) threeCanvasRef!: ElementRef<HTMLDivElement>;

  tenantService = inject(TenantService);
  courseService = inject(CourseService);

  fluencyInput = 7.5;
  lexicalInput = 7.5;
  grammarInput = 8.0;
  pronunciationInput = 8.0;

  calculatedBand = signal<number>(8.0);
  pteEquivalent = signal<number>(79);
  featuredCourses = signal<Course[]>([]);

  // Selected mock slot state
  selectedSlot = signal<string>('Tomorrow, 10:00 AM');
  bookingSuccessMessage = signal<string | null>(null);

  // Books catalog matching Stitch designs
  books = signal([
    {
      title: 'Mastering IELTS Academic',
      subtitle: 'Vol. 1: Reading & Writing',
      price: '$29.99',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'PTE Success Strategies',
      subtitle: 'Comprehensive Guide',
      price: '$34.50',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Advanced Vocabulary Builder',
      subtitle: 'For C1/C2 Certification',
      price: '$24.00',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Grammar in Context',
      subtitle: 'Spoken English Practice',
      price: '$22.99',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  private animationFrameId?: number;
  private renderer?: any;
  private resizeListener?: () => void;
  private mouseMoveListener?: (e: MouseEvent) => void;

  constructor() {
    this.calculateBand();
    this.courseService.getCourses().subscribe(courses => {
      this.featuredCourses.set(courses.slice(0, 3));
    });
  }

  ngAfterViewInit(): void {
    this.initThreeJsBuddy();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.mouseMoveListener) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.dispose();
    }
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

  selectSlot(slot: string) {
    this.selectedSlot.set(slot);
    this.bookingSuccessMessage.set(`Selected slot: ${slot}. Ready to proceed to booking.`);
    setTimeout(() => {
      this.bookingSuccessMessage.set(null);
    }, 4000);
  }

  private initThreeJsBuddy() {
    if (typeof THREE === 'undefined' || !this.threeCanvasRef) {
      return;
    }

    const container = this.threeCanvasRef.nativeElement;
    const containerWidth = container.clientWidth || 360;
    const containerHeight = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(containerWidth, containerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Academic Buddy Group
    const character = new THREE.Group();

    // Body (Deep Navy capsule)
    const bodyGeom = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 32);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x002d62, shininess: 30 }); // Brand Navy
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    character.add(body);

    // Head (Porcelain white sphere)
    const headGeom = new THREE.SphereGeometry(0.55, 32, 32);
    const headMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 40 });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = 0.95;
    character.add(head);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.07, 16, 16);
    const eyeMat = new THREE.MeshPhongMaterial({ color: 0x191c1d });
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.18, 1.02, 0.48);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.18, 1.02, 0.48);
    character.add(rightEye);

    // Academic Graduation Cap
    const capBaseGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32);
    const capMat = new THREE.MeshPhongMaterial({ color: 0x191c1d });
    const capBase = new THREE.Mesh(capBaseGeom, capMat);
    capBase.position.y = 1.45;
    character.add(capBase);

    const capTopGeom = new THREE.BoxGeometry(0.85, 0.05, 0.85);
    const capTop = new THREE.Mesh(capTopGeom, capMat);
    capTop.position.y = 1.5;
    character.add(capTop);

    // Energetic Orange Tassel
    const tasselGeom = new THREE.BoxGeometry(0.06, 0.35, 0.06);
    const tasselMat = new THREE.MeshPhongMaterial({ color: 0xfe6b00 }); // Stitch Orange
    const tassel = new THREE.Mesh(tasselGeom, tasselMat);
    tassel.position.set(0.42, 1.35, 0);
    character.add(tassel);

    scene.add(character);

    const clock = new THREE.Clock();
    const u_mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.mouseMoveListener = (e: MouseEvent) => {
      u_mouse.x = e.clientX;
      u_mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', this.mouseMoveListener);

    this.resizeListener = () => {
      if (!container) return;
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };
    window.addEventListener('resize', this.resizeListener);

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle academic floating
      character.position.y = Math.sin(elapsed * 1.5) * 0.1;

      // Mouse tracking
      const targetX = (u_mouse.x / window.innerWidth - 0.5) * 0.6;
      const targetY = (u_mouse.y / window.innerHeight - 0.5) * 0.4;
      character.rotation.y += (targetX - character.rotation.y) * 0.05;
      character.rotation.x += (targetY - character.rotation.x) * 0.05;

      this.renderer.render(scene, camera);
    };

    animate();
  }
}
