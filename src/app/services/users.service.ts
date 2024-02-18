import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../environment/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserPage } from '../models/userpage.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  public getUsers():Observable<Array<User>>{
    return this.http.get<Array<User>>(`${environments.API_URL}${environments.USERS_ENDPOINT}`);
  }

  public getOneUser(id:number):Observable<User>{
    return this.http.get<User>(`${environments.API_URL}${environments.USERS_ENDPOINT}/${id}`);
  }

  public getUsersPage(page : number,size : number):Observable<UserPage>{
    return this.http.get<UserPage>(`${environments.API_URL}${environments.USERS_PAGE_ENDPOINT}?page=${page}&size=${size}`);
  }

  public getImageOfUser(id:number) :Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/jpeg', // Adjust content type as needed
      'Accept': 'image/jpeg' // Adjust accept type as needed
    });
    return this.http.get(`${environments.API_URL}${environments.USERS_ENDPOINT}/${id}/image`,{ responseType: 'blob', headers: headers });
  }


}
