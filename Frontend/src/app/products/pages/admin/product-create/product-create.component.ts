import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '@services/product.service';
import { ProductRequest } from '@models/product-request.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.pattern(/^(https?:\/\/[^ "']+)$/)]
    });
  }

  ngOnInit(): void {}

  hasError(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }

  get formSubmitted(): boolean { return this.isSubmitting; }

  getErrorMessage(controlName: string): string {
    const c = this.productForm.get(controlName);
    if (!c || !c.errors) return '';
    if (c.errors['required']) return 'Campo obbligatorio';
    if (c.errors['min']) return `Valore minimo ${c.errors['min'].min}`;
    if (c.errors['pattern']) return 'URL non valido';
    return 'Campo non valido';
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const product: ProductRequest = {
        ...this.productForm.value,
        price: Number(this.productForm.value.price),
        stockQuantity: Number(this.productForm.value.stockQuantity)
      };

      this.productService.createProduct(product).subscribe({
        next: () => {
          this.successMessage = 'Prodotto creato con successo!';
          this.productForm.reset();
          setTimeout(() => this.router.navigate(['/admin']), 1500);
        },
        error: (err: any) => {
          console.error('Errore creazione prodotto', err);
          this.errorMessage = err.error?.message || 'Errore sconosciuto';
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Form contiene errori.';
      this.isSubmitting = false;
    }
  }
}
