import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environments } from '../environment/environment';
import { ProductPage } from '../models/productpage.model';
import { ProductImage } from '../models/productimage.model';
import { ProductDetail } from '../models/productdetails.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) { }

  public getAllProducts():Observable<Array<Product>>{
    let url =`${environments.HOST}${environments.PRODUCTS_ENDPOINT}`;
    return this.http.get<Array<Product>>(url);
  }

  public getPageOfProducts(page :number, size:number):Observable<ProductPage>{
    let url = `${environments.HOST}${environments.PRODCUTS_PAGE_ENDPOINT}?page=${page}&size=${size}`;
    return this.http.get<ProductPage>(url);
  }

  public getOneProductByID(id:number):Observable<Product>
  {
    let url =`${environments.HOST}${environments.PRODUCTS_ENDPOINT}/${id}`;
    return this.http.get<Product>(url);
  }

  public getImageOfProduct(id:number) :Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/jpeg', // Adjust content type as needed
      'Accept': 'image/jpeg' // Adjust accept type as needed
    });
    return this.http.get(`${environments.HOST}${environments.PRODUCTS_ENDPOINT}/${id}/image`,{ responseType: 'blob', headers: headers });
  }


  public createProduct(product:Product):Observable<Product>{
    return this.http.post<Product>(`${environments.HOST}${environments.PRODUCTS_ENDPOINT}`,product);
  }


  public uploadProductMainImage(id:number, formData:FormData){
    return this.http.post<any>(`${environments.HOST}${environments.PRODUCTS_ENDPOINT}/${id}/upload-main-image`,formData);
  }

  public uploadProductExtrasImages(id:number,files:File[]):Observable<any>{
    const formData = new FormData();
    files.forEach((file,index)=>{
      formData.append("files",file,file.name);
    })
    return this.http.post<any>(`${environments.HOST}${environments.PRODUCTS_ENDPOINT}/${id}/upload-extras-images`,formData);
  }


  public getExtrasImages(id:number):Observable<Array<ProductImage>>{
    return this.http.get<Array<ProductImage>>(`${environments.HOST}${environments.PRODUCTS_ENDPOINT}/${id}/extras-images`);
  }

  public getProductDetails(id:number):Observable<ProductDetail[]>{
    return this.http.get<ProductDetail[]>(`${environments.HOST}${environments.PRODUCTS_ENDPOINT}/${id}/details`);
  }

}
