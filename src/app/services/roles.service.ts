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
    return this.http.get<Array<Role>>(`${environments.HOST}${environments.ROLES_ENDPOINT}`);
  }

  public getOneRoleByID(id:number):Observable<Role>{
    return this.http.get<Role>(`${environments.HOST}${environments.ROLES_ENDPOINT}/${id}`);
  }

  public checkIfRoleExistedOrNot(roleName:string):Observable<boolean>{
    return this.http.get<boolean>(`${environments.HOST}${environments.ROLES_CHECK_EXISTENCE_ENDPOINT}/${roleName}`);
  }

  public createRole(role:Role):Observable<Role>{
    return this.http.post<Role>(`${environments.HOST}${environments.ROLES_ENDPOINT}`,role);
  }

}
