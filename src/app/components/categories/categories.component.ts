import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CategoryPage } from '../../models/categorypage.model';
import { environments } from '../../environment/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, OnDestroy{

  
  public categoriesPage$ !: Observable<CategoryPage>;
  public currentPage : number = 0;
  public pageSize : number =12;

  public categoriesHost :string ="";

 

  private unsubscribe$ = new Subject<void>();

  constructor(private categoryService :CategoriesService){}

  ngOnInit(): void {
    this.categoriesHost = environments.HOST+environments.CATEGORIES_ENDPOINT;
     this.getCategories();
 
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCategories(){
    this.categoriesPage$ = this.categoryService.getCategoriesPage(this.currentPage,this.pageSize);
  }

   

  

  goToPage(page: number) {
    this.currentPage=page;
    this.getCategories();
  
  }

}
