import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Material, CartItem } from '../../core/models/marketplace.model';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  marketplaceService = inject(MarketplaceService);
  authService = inject(AuthService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  materials = signal<Material[]>([]);
  showCartDrawer = false;
  promoCode = '';
  appliedDiscount = 0;
  checkoutLoading = false;

  get finalTotal(): number {
    const sub = this.marketplaceService.cartSubtotal();
    return Math.max(0, sub - this.appliedDiscount);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['viewCart'] === 'true') {
        this.showCartDrawer = true;
      }
    });
    this.marketplaceService.getMaterials().subscribe(res => {
      this.materials.set(res);
    });
  }

  addToCart(item: Material) {
    const cartItem: CartItem = {
      itemType: 'MATERIAL',
      referenceId: item.id,
      itemTitle: item.title,
      price: item.price,
      thumbnailUrl: item.coverImageUrl
    };
    this.marketplaceService.addToCart(cartItem);
  }

  applyPromo() {
    if (this.promoCode.trim().toUpperCase() === 'HIVE20') {
      this.appliedDiscount = this.marketplaceService.cartSubtotal() * 0.20;
      this.toast.success('Promo Code Applied', '20% Institutional discount applied.');
    } else {
      this.toast.error('Invalid Code', 'Promo code not recognized. Use HIVE20 for 20% off.');
    }
  }

  proceedCheckout() {
    if (!this.authService.isAuthenticated()) {
      this.toast.info('Sign In Required', 'Please sign in to complete checkout and link materials to your profile.');
      this.router.navigate(['/login']);
      return;
    }

    this.checkoutLoading = true;
    this.marketplaceService.checkout({
      items: this.marketplaceService.cartItems(),
      promoCode: this.appliedDiscount > 0 ? this.promoCode : undefined
    }).subscribe({
      next: order => {
        this.checkoutLoading = false;
        this.showCartDrawer = false;
        this.appliedDiscount = 0;
        this.promoCode = '';
        this.router.navigate(['/student-dashboard']);
      },
      error: () => {
        this.checkoutLoading = false;
      }
    });
  }
}
