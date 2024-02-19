import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environments } from '../environment/environment';
import { CategoryPage } from '../models/categorypage.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http : HttpClient) { }


  public getAllCategories():Observable<Array<Category>>{
    return this.http.get<Array<Category>>(`${environments.API_URL}${environments.CATEGORIES_ENDPOINT}`);
  }

  public getCategoriesPage(page : number,size : number):Observable<CategoryPage>{
    return this.http.get<CategoryPage>(`${environments.API_URL}${environments.CATEGORY_PAGE_ENDPOINT}?page=${page}&size=${size}`);
  }

  public getCategoryByID(id:number):Observable<Category>{
    return this.http.get<Category>(`${environments.API_URL}${environments.CATEGORIES_ENDPOINT}/${id}`);
  }

  public getImageOfCategory(id:number) :Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/jpeg', // Adjust content type as needed
      'Accept': 'image/jpeg' // Adjust accept type as needed
    });
    return this.http.get(`${environments.API_URL}${environments.CATEGORIES_ENDPOINT}/${id}/image`,{ responseType: 'blob', headers: headers });
  }
}
