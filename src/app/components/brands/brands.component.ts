import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BrandPage } from '../../models/brandpage.model';
import { ImageLoadingService } from '../../services/image-loading.service';
import {environments} from "../../environment/environment";

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit,OnDestroy {

  public brandsPage$ !: Observable<BrandPage>;
  public currentPage : number = 0;
  public pageSize : number =5;

  private unsubscribe$ = new Subject<void>();

  public host : string ="";

  constructor(private brandService : BrandsService){

  }

  ngOnInit(): void {
     this.getPageOfBrands();
     this.host=environments.HOST+environments.BRANDS_ENDPOINT;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPageOfBrands(){
    this.brandsPage$ = this.brandService.getPageOfBrands(this.currentPage,this.pageSize);
  }


 


  goToPage(page:number){
    this.currentPage=page;
    this.getPageOfBrands();
  }



}
