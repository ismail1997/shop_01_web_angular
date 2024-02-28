import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductImage } from '../../../models/productimage.model';
import { environments } from '../../../environment/environment';
import { ProductDetail } from '../../../models/productdetails.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit,OnDestroy{
  private unsubscribe$ = new Subject<void>();
  public product! : Product;
  public productImages!:Observable<Array<ProductImage>>;
  public productDetails!:Observable<ProductDetail[]>;
  public productsHost : string = environments.HOST+environments.PRODUCTS_ENDPOINT;
  
  constructor(private productService : ProductsService, private activatedRoute :ActivatedRoute,
    private router : Router ){}
  ngOnInit(): void {
     const productID : number = this.activatedRoute.snapshot.params['id'];
      this.retreiveProduct(productID);
      this.retreiveProductImages(productID);
      this.retreiveProductDetails(productID);
  }
  

  retreiveProduct(productID: number) {
    this.productService.getOneProductByID(productID).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.product=data;
      },
      error:error=>{
        console.log(error);
      }
    }) ; 
  }

  retreiveProductImages(productID: number) {
    this.productImages = this.productService.getExtrasImages(productID);
  }

  retreiveProductDetails(productID: number) {
    this.productDetails = this.productService.getProductDetails(productID);
  }
 
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goBackToProductsPage(){
    this.router.navigateByUrl("/admin/products")
  }

}
