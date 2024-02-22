import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CategoriesService } from '../../../services/categories.service';
import { BrandsService } from '../../../services/brands.service';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../models/category.model';
import { Brand } from '../../../models/brand.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit,OnDestroy{

  
  private unsubscribe$ = new Subject<void>();
  
  public product!:Product;
  public categories!:Array<Category>;
  public brands!:Array<Brand>;

  public selectedBrand!: Brand;
  public selectedCategory!:Category;

  constructor(
    private categoryService:CategoriesService,
    private brandService: BrandsService,
    private productService:ProductsService
  ){}


  ngOnInit(): void {
     this.initBrands();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initBrands(){
    this.brandService.getAllBrands().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.brands = data;
      },
      error:err=>{
        console.log(err);
      }
    });
  }


  onBrandSelected(event:any) {
    console.log(event.target.value)
    let id :number = event.target.value;
    this.brandService.getCategoriesOfBrand(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.categories=data;
        console.log(this.categories);
      },
      error:err=>{
        console.log(err);
      }
    })
  }



}
