import { Component, OnDestroy, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Observable, Subject } from 'rxjs';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit, OnDestroy{

  public roles$ ! : Observable<Array<Role>>;
  private unsubscribe$ = new Subject<void>();
  
  constructor(private roleService : RolesService){}

  ngOnInit(): void {
    this.getRoles();
     
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  getRoles(){
    this.roles$ = this.roleService.getAllRoles();
  }

}
