import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CategoryPage } from '../../models/categorypage.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, OnDestroy{

  
  public categoriesPage$ !: Observable<CategoryPage>;
  public currentPage : number = 0;
  public pageSize : number =12;

  imagesToShow: { [key: number]: string } = {};

  private unsubscribe$ = new Subject<void>();

  constructor(private categoryService :CategoriesService){}

  ngOnInit(): void {
     this.getCategories();
     this.getImagesForCategories();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCategories(){
    this.categoriesPage$ = this.categoryService.getCategoriesPage(this.currentPage,this.pageSize);
  }

  getImagesForCategories(): void {
    this.categoriesPage$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        data.categoryDTOS.forEach(cat=>{
          this.categoryService.getImageOfCategory(cat.id).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: d =>{
              this.createImageFromBlob(d,cat.id);
            },
            error:err=>console.log(err)
          })
        })
      },
      error:err=>console.log(err)
    })
  }

  createImageFromBlob(image: Blob, catID: number): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagesToShow[catID] = reader.result as string;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  goToPage(page: number) {
    this.currentPage=page;
    this.getCategories();
    this.imagesToShow=[];
    this.getImagesForCategories();
  }

}
