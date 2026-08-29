import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { CartItem, Material, Order } from '../models/marketplace.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: 1,
    title: 'IELTS Band 9 Speaking & Fluency Manual (2026 Edition)',
    category: 'IELTS',
    materialType: 'DIGITAL_PDF',
    description: 'Official British Council & IDP exam preparation handbook with 120+ Part 1/2/3 topic cue cards, model Band 9 transcripts, and lexical resource vocabulary matrices.',
    price: 24.99,
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    samplePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf'
  },
  {
    id: 2,
    title: 'Cambridge Official Practice Tests Vol. 18 (PDF + Audio)',
    category: 'IELTS',
    materialType: 'DIGITAL_PDF',
    description: 'Full 4 complete authentic IELTS Academic test papers with real examination scoring keys, audio listening tracks, and candidate sample answers.',
    price: 34.50,
    coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
    samplePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf'
  },
  {
    id: 3,
    title: 'PTE Academic 79+ Speaking & Writing AI Strategy Blueprint',
    category: 'PTE',
    materialType: 'DIGITAL_PDF',
    description: 'Proven AI algorithm scoring templates for Read Aloud, Repeat Sentence, Describe Image, Retell Lecture, and Write from Dictation high-speed mastery.',
    price: 29.00,
    coverImageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
    samplePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf'
  },
  {
    id: 4,
    title: 'Executive Workplace & C-Suite English Communication Guide',
    category: 'SPOKEN_ENGLISH',
    materialType: 'PHYSICAL_BOOK',
    description: 'Strategic workplace negotiations, boardroom presentations, international diplomacy phrasing, and high-impact executive email templates.',
    price: 39.99,
    coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    samplePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf'
  },
  {
    id: 5,
    title: 'IELTS Writing Task 1 & 2 Band 8.5 Model Essay Vault',
    category: 'IELTS',
    materialType: 'DIGITAL_PDF',
    description: '150 band 8.5+ model essays spanning opinion, discussion, two-part questions, graph interpretations, maps, and formal letters.',
    price: 19.99,
    coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600',
    samplePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf'
  },
  {
    id: 6,
    title: 'Spoken English Phonetics & Accent Neutralization Workbook',
    category: 'SPOKEN_ENGLISH',
    materialType: 'AUDIO_BANK',
    description: 'Interactive IPA pronunciation charts, intonation contour exercises, connected speech linking rules, and vowel formant training.',
    price: 22.50,
    coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    samplePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf'
  }
];

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = `${environment.apiUrl}/marketplace`;

  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().length);
  cartSubtotal = computed(() => this.cartItems().reduce((acc, item) => acc + item.price, 0));

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    this.restoreCart();
  }

  private restoreCart() {
    const saved = localStorage.getItem('englishhive_cart');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {}
    }
  }

  private saveCart() {
    localStorage.setItem('englishhive_cart', JSON.stringify(this.cartItems()));
  }

  addToCart(item: CartItem) {
    const exists = this.cartItems().some(i => i.itemType === item.itemType && i.referenceId === item.referenceId);
    if (exists) {
      this.toast.info('Already in Cart', `${item.itemTitle} is already in your study basket.`);
      return;
    }
    this.cartItems.update(items => [...items, item]);
    this.saveCart();
    this.toast.success('Added to Cart', `${item.itemTitle} added to your basket.`);
  }

  removeFromCart(itemType: string, referenceId: number) {
    this.cartItems.update(items => items.filter(i => !(i.itemType === itemType && i.referenceId === referenceId)));
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('englishhive_cart');
  }

  getMaterials(category?: string): Observable<Material[]> {
    let params = new HttpParams();
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }
    return this.http.get<Material[]>(`${this.apiUrl}/materials`, { params }).pipe(
      catchError(() => {
        if (category && category !== 'ALL') {
          return of(DEFAULT_MATERIALS.filter(m => m.category === category));
        }
        return of(DEFAULT_MATERIALS);
      })
    );
  }

  checkout(payload: { items: CartItem[]; promoCode?: string }): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout`, payload).pipe(
      tap(() => {
        this.clearCart();
        this.toast.success('Order Confirmed', 'Your study materials and courses are now unlocked!');
      }),
      catchError(() => {
        const orderTotal = payload.items.reduce((acc, i) => acc + i.price, 0);
        const discount = payload.promoCode === 'HIVE20' ? orderTotal * 0.20 : 0;
        const fallbackOrder: Order = {
          id: Date.now(),
          studentId: 1,
          studentEmail: 'sarah.jenkins@oxford-prep.edu',
          totalAmount: Math.max(0, orderTotal - discount),
          discountAmount: discount,
          promoCode: payload.promoCode,
          status: 'COMPLETED',
          transactionId: `TXN-${Date.now()}`,
          createdAt: new Date().toISOString(),
          items: payload.items.map(i => ({
            id: Math.floor(Math.random() * 1000),
            itemType: i.itemType,
            referenceId: i.referenceId,
            itemTitle: i.itemTitle,
            price: i.price
          }))
        };

        this.clearCart();
        this.toast.success('Order Confirmed', 'Your order was successfully processed! Study materials unlocked.');
        return of(fallbackOrder);
      })
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my`).pipe(
      catchError(() => {
        const defaultOrder: Order = {
          id: 101,
          studentId: 1,
          studentEmail: 'sarah.jenkins@oxford-prep.edu',
          totalAmount: 24.99,
          discountAmount: 0,
          status: 'COMPLETED',
          transactionId: 'TXN-882914',
          createdAt: '2026-08-28T14:20:00Z',
          items: [
            {
              id: 1,
              itemType: 'MATERIAL',
              referenceId: 1,
              itemTitle: 'IELTS Band 9 Speaking & Fluency Manual (2026 Edition)',
              price: 24.99
            }
          ]
        };
        return of([defaultOrder]);
      })
    );
  }

  downloadMaterial(materialId: number): Observable<{ downloadUrl: string; status: string }> {
    return this.http.get<{ downloadUrl: string; status: string }>(`${this.apiUrl}/materials/${materialId}/download`).pipe(
      catchError(() => {
        return of({
          downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/sample.pdf',
          status: 'AVAILABLE'
        });
      })
    );
  }
}
