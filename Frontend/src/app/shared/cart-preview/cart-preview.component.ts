import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartResponse } from '@models/cart-response.model';

@Component({
  selector: 'app-cart-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-preview.component.html',
  styleUrls: ['./cart-preview.component.scss'],
})
export class CartPreviewComponent {
  @Input() cart: CartResponse | null = null;
  @Output() close = new EventEmitter<void>();

  closePanel(): void {
    this.close.emit();
  }

  trackByItem(index: number, item: any): number {
    return item?.id ?? index;
  }

  toggle(): void {
    this.close.emit();
  }
}
