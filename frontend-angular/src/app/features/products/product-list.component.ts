import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { getProductImage } from '../../core/utils/product-image.util';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  previewImage: string | null = null;
  previewTitle = '';

  page = 1;
  limit = 6;
  total = 0;
  totalPages = 1;

  categoria = '';
  activo = '';
  search = '';

  alertType: 'success' | 'danger' | '' = '';
  alertMessage = '';

  constructor(
    private readonly productsService: ProductsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService
      .getAll({
        page: this.page,
        limit: this.limit,
        categoria: this.categoria,
        activo: this.activo,
        search: this.search
      })
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.total = response.meta.total;
          this.totalPages = Math.max(1, Math.ceil(this.total / this.limit));
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert('danger', error?.error?.message || 'No se pudieron obtener los productos');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.categoria = '';
    this.activo = '';
    this.search = '';
    this.page = 1;
    this.loadProducts();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadProducts();
    }
  }

  removeProduct(id: string): void {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este producto?');
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.productsService.delete(id).subscribe({
      next: (response) => {
        this.showAlert('success', response.message || 'Producto eliminado correctamente');
        this.loadProducts();
      },
      error: (error) => {
        this.showAlert('danger', error?.error?.message || 'No se pudo eliminar el producto');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private showAlert(type: 'success' | 'danger', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
  }

  resolveImage(product: Product): string {
    return getProductImage(product);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://placehold.co/640x420?text=Producto+deportivo';
  }

  openPreview(image: string, title: string): void {
    this.previewImage = image;
    this.previewTitle = title;
  }

  closePreview(): void {
    this.previewImage = null;
    this.previewTitle = '';
  }
}
