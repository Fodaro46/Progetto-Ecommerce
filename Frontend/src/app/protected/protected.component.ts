import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>🔒 Protected</h1><p>Se vedi questa pagina, sei loggato!</p>`,
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent {}
