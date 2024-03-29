import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../../services/roles.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent implements OnInit, OnDestroy{



  public createRoleFromGroup!: FormGroup;
  public roleExist : boolean =false;
  private unsubscribe$ = new Subject<void>();

  constructor(private fb : FormBuilder,private roleService:RolesService, private router:Router){}

  ngOnInit(): void {
     this.createForme();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createForme(){
    this.createRoleFromGroup= this.fb.group({
      name : this.fb.control("",[Validators.required,Validators.minLength(4),Validators.maxLength(15)]),
      description:this.fb.control("",[Validators.required,Validators.minLength(4),Validators.maxLength(150)])
    });
  }

  checkIfRoleExistedAlready(){
    const roleName = this.createRoleFromGroup.value.name;
    if (!roleName.trim()) {
      this.roleExist = false; // Reset if name is empty
      return;
    }
    this.roleService.checkIfRoleExistedOrNot(roleName).pipe(takeUntil(this.unsubscribe$)).subscribe(
      {
        next:data=> {
          this.roleExist=data;
        }
      }
    )

  }

  handleCreateRole(){
    let role = this.createRoleFromGroup.value;

    this.roleService.createRole(role).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        alert("Role has been successfully saved!");
        //this.createCustomerFormGroup.reset();
        
      },
      error:err=>{

      }
    })
  }

  onCancelButton() {
   this.goBackToRolesPage();
  }

  goBackToRolesPage() {
    this.router.navigateByUrl("/admin/roles");
  }

}
