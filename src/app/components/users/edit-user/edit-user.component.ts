import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { RolesService } from '../../../services/roles.service';
import { environments } from '../../../environment/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit,OnDestroy{
  public user :User | undefined ;
  private unsubscribe$ = new Subject<void>();
  public availableRoles : Array<Role> = [];

  public editUserForm !: FormGroup;

  errorMessage: string | null = null;

  public usersHost:string = environments.HOST+environments.USERS_ENDPOINT;

  constructor(private userService:UsersService,private activatedRoute:ActivatedRoute,private fb: FormBuilder,
    private router:Router,private roleService : RolesService){

  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.userService.getOneUser(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.user=data;

        //getting roles
        this.roleService.getAllRoles().pipe(takeUntil(this.unsubscribe$)).subscribe({
          next:data=>{
            this.availableRoles=data;
          },
          error:err=>console.log(err)
        })
        
        this.creatForm();
      },
      error:error=>{
        console.log(error);
      },
    });
    
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  creatForm(){
   if(this.user){
    this.editUserForm=this.fb.group({
      firstName:[this.user.firstName,[Validators.required,Validators.minLength(4),Validators.maxLength(15)]],

      lastName:[this.user.lastName,[Validators.required,Validators.minLength(4),Validators.maxLength(15)]],

      address:[this.user.address,[Validators.maxLength(255)]],

      postalCode:[this.user.postalCode,[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],

      password:[this.user.password,[Validators.required,Validators.minLength(6),Validators.maxLength(25)]],

      city:[this.user.city,[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],

      country:[this.user.country,[Validators.required,Validators.minLength(3),Validators.maxLength(25)]],

      enabled:[this.user.enabled,false],

      roles: this.fb.array([])
    })
   }
  }


  submitForm():void{
    const updatedUser : User = this.editUserForm.value;

    if(this.user?.roles) updatedUser.roles = this.user?.roles
    if(this.user?.email) updatedUser.email = this.user.email;
    if(this.user?.id)    updatedUser.id    = this.user.id;

    const formData = new FormData();
    if(this.selectedImageFile){
      formData.append('image', this.selectedImageFile);
    }
    

    this.userService.updateUser(updatedUser.id,updatedUser).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
       if(this.selectedImageFile){
        this.userService.uploadImage(updatedUser.id,formData).pipe(takeUntil(this.unsubscribe$)).subscribe({
          next:data=>{
            console.log("image uploaded successfully");
          },
          error:err=>{
            console.log("error uploading image")
          },
          complete:() => this.router.navigateByUrl("/admin/users?message=User%20Updated%20Successfully")
        })
       }else{
          this.router.navigateByUrl("/admin/users?message=User%20Updated%20Successfully");
       }
      },
      error:err=>{
        console.log(err);
      },
    })
  }


  hasRole(role: Role): boolean {
    return this.user?.roles.some((userRole) => userRole.id === role.id) ?? false;
  }

  // Handle role checkbox change
  onRoleChange(role: Role, event: any): void {
    if (event.target.checked) {
      // Add role
      this.user?.roles.push(role);
    } else {
      // Remove role
      this.user!.roles = this.user!.roles.filter((userRole) => userRole.id !== role.id);
    }
  }
  handleCancel():void{
    this.goToUsers();
  }

  goToUsers():void{
    this.router.navigateByUrl("/admin/users");
  }



  maxSizeInBytes: number = 500 * 1024; // 500 KB
  /*
  this for image
  */
   // Property to store the selected image file
   selectedImageFile: File | null = null;
   // Property to store the image preview URL
   imagePreview: string | ArrayBuffer | null = null;

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

}
