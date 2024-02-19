import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent implements OnInit, OnDestroy{

  public createRoleFromGroup!: FormGroup;

  constructor(private fb : FormBuilder){}

  ngOnInit(): void {
     this.createForme();
  }
  ngOnDestroy(): void {
     
  }

  createForme(){
    this.createRoleFromGroup= this.fb.group({
      name : this.fb.control("",[Validators.required,Validators.minLength(4),Validators.maxLength(15)]),
      description:this.fb.control("",[Validators.required,Validators.minLength(4),Validators.maxLength(150)])
    });
  }


  handleCreateRole(){

  }

}
