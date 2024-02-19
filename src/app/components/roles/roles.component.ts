import { Component, OnDestroy, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Observable } from 'rxjs';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit, OnDestroy{

  public roles$ ! : Observable<Array<Role>>;

  constructor(private roleService : RolesService){}

  ngOnInit(): void {
    this.getRoles();
     
  }
  ngOnDestroy(): void {
     
  }


  getRoles(){
    this.roles$ = this.roleService.getAllRoles();
  }

}
