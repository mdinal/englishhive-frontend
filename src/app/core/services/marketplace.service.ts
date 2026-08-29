import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartItem, Material, Order } from '../models/marketplace.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

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
    return this.http.get<Material[]>(`${this.apiUrl}/materials`, { params });
  }

  checkout(payload: { items: CartItem[]; promoCode?: string }): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout`, payload).pipe(
      tap(() => {
        this.clearCart();
        this.toast.success('Order Confirmed', 'Your study materials and courses are now unlocked!');
      })
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my`);
  }

  downloadMaterial(materialId: number): Observable<{ downloadUrl: string; status: string }> {
    return this.http.get<{ downloadUrl: string; status: string }>(`${this.apiUrl}/materials/${materialId}/download`);
  }
}
