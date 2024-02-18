import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserPage } from '../../models/userpage.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {



  public usersPage$ !:Observable<UserPage>;
  public currentPage : number = 0;
  public pageSize : number =10;

  imagesToShow: { [key: number]: string } = {};

  constructor(private usersService : UsersService, private route : Router){}

  ngOnInit(): void {
    this.getUsers();
    this.getImagesForUsers();
  }
  ngOnDestroy(): void {
     
  }

  getUsers(){
    this.usersPage$ = this.usersService.getUsersPage(this.currentPage,this.pageSize);
  }

  onGetUserDetails(id: number) {
    this.route.navigateByUrl(`/admin/user-details/${id}`);
  }

  goToPage(page: number) {
    this.currentPage=page;
    this.getUsers();
    this.imagesToShow=[];
    this.getImagesForUsers();
  }

  getImagesForUsers(): void {
    this.usersPage$.subscribe({
      next:data=>{
        data.userDTOS.forEach(user=>{
          this.usersService.getImageOfUser(user.id).subscribe({
            next: d =>{
              this.createImageFromBlob(d,user.id);
            },
            error:err=>console.log(err)
          })
        })
      },
      error:err=>console.log(err)
    })
  }

  createImageFromBlob(image: Blob, userId: number): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagesToShow[userId] = reader.result as string;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
