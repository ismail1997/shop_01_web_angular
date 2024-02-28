import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductPage } from '../../models/productpage.model';
import { ProductsService } from '../../services/products.service';
import { ImageLoadingService } from '../../services/image-loading.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { environments } from '../../environment/environment';

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
  public productsHost : string = environments.HOST+environments.PRODUCTS_ENDPOINT;



  constructor(private productService: ProductsService,
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
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.getProductsPage();
  }





  onGetProductDetails(productId: number) {
    this.router.navigateByUrl("/admin/product-details/"+productId);
  }
}
