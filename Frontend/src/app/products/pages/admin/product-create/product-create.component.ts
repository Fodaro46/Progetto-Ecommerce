import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@services/product.service';
import { Router } from '@angular/router';
import { ProductRequest } from '@models/product-request.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  formSubmitted = false;
  successMessage = '';  // Sostituisce l'alert con messaggio nel template

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', [Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
    });
  }

  ngOnInit(): void {}

  hasError(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo obbligatorio';
    if (control.errors['min']) {
      return `Il valore minimo consentito è ${control.errors['min'].min}`;
    }
    if (control.errors['pattern']) return 'URL non valido';
    return 'Campo non valido';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      this.isSubmitting = true;

      const product: ProductRequest = {
        ...this.productForm.value,
        price: Number(this.productForm.value.price),
        stockQuantity: Number(this.productForm.value.stockQuantity)
      };

      this.productService.createProduct(product).subscribe({
        next: (response) => {
          console.log('Prodotto creato con successo', response);
          this.successMessage = 'Prodotto creato con successo!';
          this.productForm.reset();
          Object.keys(this.productForm.controls).forEach(key => {
            this.productForm.get(key)?.setErrors(null);
          });

          setTimeout(() => {
            this.router.navigate(['/admin']);
            this.isSubmitting = false;
          }, 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message ||
            `Errore nella creazione (${err.status}): ${err.statusText || 'Errore sconosciuto'}`;
          console.error('Errore dettagliato:', err);
        }
      });
    } else {
      this.errorMessage = 'Il form contiene errori. Controlla i campi evidenziati.';
    }
  }
}
