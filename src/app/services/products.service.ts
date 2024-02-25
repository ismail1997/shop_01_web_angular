import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environments } from '../environment/environment';
import { ProductPage } from '../models/productpage.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) { }

  public getAllProducts():Observable<Array<Product>>{
    let url =`${environments.API_URL}${environments.PRODUCTS_ENDPOINT}`;
    return this.http.get<Array<Product>>(url);
  }

  public getPageOfProducts(page :number, size:number):Observable<ProductPage>{
    let url = `${environments.API_URL}${environments.PRODCUTS_PAGE_ENDPOINT}?page=${page}&size=${size}`;
    return this.http.get<ProductPage>(url);
  }

  public getOneProductByID(id:number):Observable<Product>
  {
    let url =`${environments.API_URL}${environments.PRODUCTS_ENDPOINT}/${id}`;
    return this.http.get<Product>(url);
  }

  public getImageOfProduct(id:number) :Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/jpeg', // Adjust content type as needed
      'Accept': 'image/jpeg' // Adjust accept type as needed
    });
    return this.http.get(`${environments.API_URL}${environments.PRODUCTS_ENDPOINT}/${id}/image`,{ responseType: 'blob', headers: headers });
  }


  public createProduct(product:Product):Observable<Product>{
    return this.http.post<Product>(`${environments.API_URL}${environments.PRODUCTS_ENDPOINT}`,product);
  }


  public uploadProductMainImage(id:number, formData:FormData){
    return this.http.post<any>(`${environments.API_URL}${environments.PRODUCTS_ENDPOINT}/${id}/upload-main-image`,formData);
  }

  public uploadProductExtrasImages(id:number,files:File[]):Observable<any>{
    const formData = new FormData();
    files.forEach((file,index)=>{
      formData.append("files",file,file.name);
    })
    return this.http.post<any>(`${environments.API_URL}${environments.PRODUCTS_ENDPOINT}/${id}/upload-extras-images`,formData);
  }

}
