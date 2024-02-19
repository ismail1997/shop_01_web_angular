import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { environments } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http:HttpClient) { }


  public getAllRoles():Observable<Array<Role>>{
    return this.http.get<Array<Role>>(`${environments.API_URL}${environments.ROLES_ENDPOINT}`);
  }

  public getOneRoleByID(id:number):Observable<Role>{
    return this.http.get<Role>(`${environments.API_URL}${environments.ROLES_ENDPOINT}/${id}`);
  }
}
