import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail.component';
import { ProductFormComponent } from './features/products/product-form.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'productos' },
	{ path: 'productos', component: ProductListComponent },
	{ path: 'productos/nuevo', component: ProductFormComponent },
	{ path: 'productos/editar/:id', component: ProductFormComponent },
	{ path: 'productos/:id', component: ProductDetailComponent },
	{ path: '**', redirectTo: 'productos' }
];
