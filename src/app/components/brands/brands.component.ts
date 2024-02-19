import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { Observable } from 'rxjs';
import { BrandPage } from '../../models/brandpage.model';
import { ImageLoadingService } from '../../services/image-loading.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit,OnDestroy {

  public brandsPage$ !: Observable<BrandPage>;
  public currentPage : number = 0;
  public pageSize : number =5;

  constructor(private brandService : BrandsService, public imageLoadingService:ImageLoadingService){}

  ngOnInit(): void {
     this.getPageOfBrands();
  }
  ngOnDestroy(): void {
     
  }

  getPageOfBrands(){
    this.brandsPage$ = this.brandService.getPageOfBrands(this.currentPage,this.pageSize);
    this.getImageOfBrands();
  }


  getImageOfBrands(){
    this.brandsPage$.subscribe({
      next: data=>{
        data.brandDTOS.forEach(brand=>{
          this.brandService.getImageOfBrand(brand.id).subscribe({
            next: d =>{
              this.imageLoadingService.createImageFromBlob(d,brand.id);
            },
            error:err=>console.log(err)
          })
        })
      },
      error:error=>console.log(error)
    })
  }


  goToPage(page:number){
    this.currentPage=page;
    this.getPageOfBrands();
    this.imageLoadingService.imagesToShow=[];
    this.getImageOfBrands();
  }



}
