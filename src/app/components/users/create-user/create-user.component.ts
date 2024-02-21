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



  public roles !:Observable<Role[]>;
  public createUserForm !: FormGroup;
  public user: User = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    postalCode: '',
    password: '',
    city: '',
    enabled: false,
    roles: [] // Assuming roles is an array of roles
    ,
    id: 0,
    photos: '',
    country: ''
  };

  public emailExisted : boolean =false;

  public selectedRoles! : Role[];

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
    this.roles=this.roleService.getAllRoles();
  }

  creatForm(){
    
    this.createUserForm=this.fb.group({
      firstName:[this.user.firstName,[Validators.required,Validators.minLength(5),Validators.maxLength(15)]],

      lastName:[this.user.lastName,[Validators.required,Validators.minLength(5),Validators.maxLength(15)]],

      email:[this.user.email,[Validators.required,Validators.email,Validators.maxLength(128)]],

      address:[this.user.address,[Validators.maxLength(255)]],

      postalCode:[this.user.postalCode,[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],

      password:[this.user.country,[Validators.required,Validators.minLength(6),Validators.maxLength(25)]],

      city:[this.user.city,[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],

      country:[this.user.city,[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],

      enabled:[this.user.enabled,false],

      roles: this.fb.array(this.user.roles.map(role => this.fb.group({
        id: [role.id],
        name: [role.name],
        description: [role.description]
      })))
    })
  }

  submitForm(){
    console.log(this.selectedRoles);
    this.user = this.createUserForm.value;
    if(this.selectedRoles){
      this.user.roles=this.selectedRoles;
    }
    console.log(this.user);

    this.userService.createUser(this.user).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        const savedUser : User = data;
        const formData = new FormData();
        if(this.selectedImageFile){
          formData.append('image', this.selectedImageFile);
        }
        
        this.userService.uploadImage(savedUser.id,formData).pipe(takeUntil(this.unsubscribe$)).subscribe({
          next:(d)=>{
           console.log(d)
          },
          error:err=>console.log(err),
        })

        //this.router.navigateByUrl("/admin/users?message=User%20Created%20Successfully");
      },
      error:err=>{
        console.log(err);
      }
    })

  }

  onRoleCheckBoxChange($event:any) {
    const checkArray: FormArray = this.createUserForm.get('roles') as FormArray;
    if ($event.target.checked) {
      console.log($event.target.value)
      checkArray.push(new FormControl($event.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == $event.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.selectedRoles = [];
    this.roles.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        
        checkArray.value.forEach((id:any)=>{
          const role = data.find(rl=>rl.id===parseInt(id));
          if(role){
            this.selectedRoles.push(role);
          }
        })
      }
    })
  }


  checkIfEmailExistedOrNot() {
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

  onFileSelected(event: Event) {
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

  handleCancel(){
    this.router.navigateByUrl("/admin/users");
  }

}
