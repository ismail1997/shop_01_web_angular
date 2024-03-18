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
    return this.http.get<Array<User>>(`${environments.HOST}${environments.USERS_ENDPOINT}`);
  }

  public getOneUser(id:number):Observable<User>{
    return this.http.get<User>(`${environments.HOST}${environments.USERS_ENDPOINT}/${id}`);
  }

  public getUsersPage(page : number,size : number):Observable<UserPage>{
    return this.http.get<UserPage>(`${environments.HOST}${environments.USERS_PAGE_ENDPOINT}?page=${page}&size=${size}`);
  }

  public getImageOfUser(id:number) :Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/jpeg', // Adjust content type as needed
      'Accept': 'image/jpeg' // Adjust accept type as needed
    });
    return this.http.get(`${environments.HOST}${environments.USERS_ENDPOINT}/${id}/image`,{ responseType: 'blob', headers: headers });
  }

  public checkIfEmailExistedAlready(email:string):Observable<boolean>{
    return this.http.get<boolean>(`${environments.HOST}${environments.USERS_CHECK_EMAIL_UNIQUENESS}/${email}`);
  }

  public uploadImage(id:number, formData:FormData){
    return this.http.post<any>(`${environments.HOST}${environments.USERS_ENDPOINT}/${id}/upload-image`,formData);
  }

  public createUser(user:User):Observable<User>{
    return this.http.post<User>(`${environments.HOST}${environments.USERS_ENDPOINT}`,user);
  }

  public updateUserEnabledStatus(id:number,enabled: boolean | null = false){
    return this.http.put(`${environments.HOST}${environments.USERS_ENDPOINT}/${id}${environments.USERS_UPDATE_ENABLED_STATUS}?enabled=${enabled !== null ? enabled : false}`,{enabled});
  }

  public updateUser(id:number, user : User):Observable<User>{
    return this.http.put<User>(`${environments.HOST}${environments.USERS_ENDPOINT}/${id}`,user);
  }

}
