import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { RolesService } from '../../../services/roles.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Role } from '../../../models/role.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit,OnDestroy{



  public listRoles : Role[] = [];
  public idOfSelectedRoles: number[] = []
  public createUserForm !: FormGroup;
  

  public emailExisted : boolean =false;

  public selectedRoles: Role[] = [];

  maxSizeInBytes: number = 500 * 1024; // 500 KB
  errorMessage: string | null = null;


  /*
  this for image
  */
   // Property to store the selected image file
   selectedImageFile: File | null = null;
   // Property to store the image preview URL
   imagePreview: string | ArrayBuffer | null = null;

   private unsubscribe$ = new Subject<void>();


  constructor(private userService : UsersService, private roleService : RolesService,private fb: FormBuilder,
    private router:Router){}

  ngOnInit(): void {
     this.getRoles();
     this.creatForm();
  }
  ngOnDestroy(): void {
     this.unsubscribe$.next();
     this.unsubscribe$.complete();
  }


  getRoles(){
    this.roleService.getAllRoles().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.listRoles=data;
      },
      error:error=>{
        //TODO: handle the errors 
        console.log("Couldn't retreive roles "); 
      },
    });
  }

  creatForm(){
    
    this.createUserForm=this.fb.group({
      firstName:[null,[Validators.required,Validators.minLength(4),Validators.maxLength(15)]],

      lastName:[null,[Validators.required,Validators.minLength(4),Validators.maxLength(15)]],

      email:[null,[Validators.required,Validators.email,Validators.maxLength(128)]],

      address:[null,[Validators.maxLength(255)]],

      postalCode:[null,[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],

      password:[null,[Validators.required,Validators.minLength(6),Validators.maxLength(25)]],

      city:[null,[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],

      country:[null,[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],

      enabled:[null,false],

      roles: this.fb.array([])
    })
  }

  submitForm():void{
    const user : User = this.createUserForm.value;
    
    if(this.selectedRoles){
      user.roles=this.selectedRoles;
    }


    this.userService.createUser(user)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next:(data : User)=>{
        
        const formData = new FormData();
        if(this.selectedImageFile){
          formData.append('image', this.selectedImageFile);
        }
        
        this.userService.uploadImage(data.id,formData).pipe(takeUntil(this.unsubscribe$)).subscribe({
          next:(d)=>{
           
          },
          error:err=>console.log(err),
        })

        this.router.navigateByUrl("/admin/users?message=User%20Created%20Successfully");
      },
      error:err=>{
        console.log(err);
      }
    })

  }

  onRoleCheckBoxChange($event:any):void {

    let idOfRole = $event?.target.value;

    if($event.target.checked){
      this.idOfSelectedRoles.push(idOfRole);
    }else{
      this.idOfSelectedRoles=this.idOfSelectedRoles.filter(num=>num!== idOfRole);
    }
    
    this.selectedRoles=[];
    this.idOfSelectedRoles.forEach(data=>{
      
      const role : Role | undefined = this.listRoles.find(rl=>rl.id==data);
      if(role){
        this.selectedRoles.push(role);
      }
    });    
    
  }


  checkIfEmailExists():void {
    const email = this.createUserForm.value.email;
    if(!email.trim()){
      this.emailExisted=false;
      return ;
    }
    this.userService.checkIfEmailExistedAlready(email).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.emailExisted=data;
      }
    })
  }

  onFileSelected(event: Event):void {
    this.imagePreview=null;
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      if (file.size > this.maxSizeInBytes) {
        this.errorMessage = 'File size exceeds the limit (500 KB).';
        // Clear the input value to allow selecting a new file
        inputElement.value = '';
      } else {
        this.errorMessage = null;
        this.selectedImageFile = file;
        // Proceed with generating image preview
        
        this.generateImagePreview(file);
      }
    }
  }

  generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  }

  handleCancel():void{
    this.goToUsers();
  }

  goToUsers():void{
    this.router.navigateByUrl("/admin/users");
  }

}
