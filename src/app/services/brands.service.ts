import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';
import { environments } from '../environment/environment';
import { BrandPage } from '../models/brandpage.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private http : HttpClient) { }


  public getAllBrands():Observable<Array<Brand>>{
    return this.http.get<Array<Brand>>(`${environments.HOST}${environments.BRANDS_ENDPOINT}`);
  }

  public getPageOfBrands(page :number, size:number):Observable<BrandPage>{
    return this.http.get<BrandPage>(`${environments.HOST}${environments.BRANDS_PAGE_ENDPOINT}?page=${page}&size=${size}`);
  }

  public getOneBrandByID(id:number):Observable<Brand>{
    return this.http.get<Brand>(`${environments.HOST}${environments.BRANDS_ENDPOINT}/${id}`);
  }

  /**
   *  This method is to get the categories of a specific Brand
   * @param id (number) : the id of brand
   * @returns  Observable of Array of categories
   */
  public getCategoriesOfBrand(id:number) : Observable<Array<Category>>{
    return this.http.get<Array<Category>>(`${environments.HOST}${environments.BRANDS_ENDPOINT}/${id}/categories`);
  }

  public getImageOfBrand(id:number) :Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/jpeg', // Adjust content type as needed
      'Accept': 'image/jpeg' // Adjust accept type as needed
    });
    return this.http.get(`${environments.HOST}${environments.BRANDS_ENDPOINT}/${id}/image`,{ responseType: 'blob', headers: headers });
  }

}
