import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductPage } from '../../models/productpage.model';
import { ProductsService } from '../../services/products.service';
import { ImageLoadingService } from '../../services/image-loading.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {


  private unsubscribe$ = new Subject<void>();
  public productsPage$!: Observable<ProductPage>;
  public currentPage: number = 0;
  public pageSize: number = 7;



  constructor(private productService: ProductsService, public imageLoadingService: ImageLoadingService,
    private router : Router) { }

  ngOnInit(): void {
    this.getProductsPage();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getProductsPage(): void {
    this.productsPage$ = this.productService.getPageOfProducts(this.currentPage, this.pageSize);
    this.loadImagesForProducts();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.getProductsPage();
  }

  loadImagesForProducts(): void {
    this.productsPage$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data: ProductPage) => {
        data.productDTOS.forEach(product => {
          this.productService.getImageOfProduct(product.id).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: (imageData: Blob) => {
              this.imageLoadingService.createImageFromBlob(imageData, product.id);
            },
            error: (err: any) => {
              console.error('Error loading image for product:', err);
              // Handle error as per your application's requirements
            }
          });
        });
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
        // Handle error as per your application's requirements
      }
    });
  }



  onGetProductDetails(productId: number) {
    this.router.navigateByUrl("/admin/product-details/"+productId);
  }
}
