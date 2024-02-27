import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit,OnDestroy{
  private unsubscribe$ = new Subject<void>();
  public product! : Product;
  
  constructor(private productService : ProductsService, private activatedRoute :ActivatedRoute){}
  ngOnInit(): void {
     const productID : number = this.activatedRoute.snapshot.params['id'];
      this.retreiveProduct(productID);
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
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
