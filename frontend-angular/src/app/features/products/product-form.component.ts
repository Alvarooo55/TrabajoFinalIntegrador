import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductPayload } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  readonly categories = ['calzado', 'ropa', 'accesorios', 'equipamiento'];

  loading = false;
  isEditMode = false;
  productId = '';

  alertType: 'success' | 'danger' | '' = '';
  alertMessage = '';

  form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productsService: ProductsService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      precio: [1, [Validators.required, Validators.min(1), Validators.max(10000)]],
      fechaIngreso: ['', [Validators.required]],
      activo: [true, [Validators.required]],
      categoria: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = Boolean(id);

    if (id) {
      this.productId = id;
      this.loadProduct(id);
    }
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const payload = this.form.getRawValue() as ProductPayload;

    if (!payload.activo && payload.stock > 0) {
      this.showAlert('danger', 'Si el producto está inactivo, el stock debe ser 0');
      return;
    }

    this.loading = true;

    const request$ = this.isEditMode
      ? this.productsService.update(this.productId, payload)
      : this.productsService.create(payload);

    request$.subscribe({
      next: (response) => {
        this.showAlert('success', response.message || 'Operación realizada correctamente');
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 500);
      },
      error: (error) => {
        this.showAlert('danger', error?.error?.message || 'No se pudo guardar el producto');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.productsService.getById(id).subscribe({
      next: (response) => {
        const product = response.data;
        this.form.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          fechaIngreso: product.fechaIngreso?.slice(0, 10),
          activo: product.activo,
          categoria: product.categoria,
          stock: product.stock
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert('danger', error?.error?.message || 'No se pudo cargar el producto');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private showAlert(type: 'success' | 'danger', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
  }
}
