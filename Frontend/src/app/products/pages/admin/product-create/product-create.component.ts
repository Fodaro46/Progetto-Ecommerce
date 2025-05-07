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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]], // Aggiunto campo categoria
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    console.log('ProductCreateComponent inizializzato');
  }

  hasError(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo obbligatorio';
    if (control.errors['min']) {
      if (controlName === 'price') return `Il prezzo deve essere almeno ${control.errors['min'].min}`;
      if (controlName === 'stockQuantity') return `La quantità deve essere almeno ${control.errors['min'].min}`;
    }
    return 'Campo non valido';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      this.isSubmitting = true;

      const product: ProductRequest = {
        ...this.productForm.value,
        // Converti in numero per sicurezza
        price: Number(this.productForm.value.price),
        stockQuantity: Number(this.productForm.value.stockQuantity)
      };

      this.productService.createProduct(product).subscribe({
        next: (response) => {
          console.log('Prodotto creato con successo', response);
          alert('Prodotto creato!');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message ||
            `Errore nella creazione del prodotto: ${err.statusText || 'Errore sconosciuto'}`;
          console.error('Errore dettagliato:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Il form contiene errori. Controlla i campi evidenziati.';
    }
  }
}
