import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { UserPage } from '../../models/userpage.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {




  public usersPage$ !: Observable<UserPage>;
  public currentPage: number = 0;
  public pageSize: number = 10;

  imagesToShow: { [key: number]: string } = {};

  public message: string | null = null;

  private unsubscribe$ = new Subject<void>();


  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showMessageOfCreation();
    this.getUsers();
    this.getImagesForUsers();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUsers() {
    this.usersPage$ = this.usersService.getUsersPage(this.currentPage, this.pageSize);
  }

  onGetUserDetails(id: number) {
    this.router.navigateByUrl(`/admin/user-details/${id}`);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getUsers();
    this.imagesToShow = [];
    this.getImagesForUsers();
  }

  getImagesForUsers(): void {
    this.usersPage$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        data.userDTOS.forEach(user => {
          this.usersService.getImageOfUser(user.id).pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: d => {
              this.createImageFromBlob(d, user.id);
            },
            error: err => console.log(err)
          })
        })
      },
      error: err => console.log(err)
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

  showMessageOfCreation() {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.message = params['message'] || null;
      if (this.message) {
        setTimeout(() => {
          this.message = null;
          const cleanedUrl = this.router.url.split('?')[0];
          history.replaceState(null, '', cleanedUrl); // Clean the URL
        }, 3000); // Remove message after 3 seconds
      }
    });
  }

  changeUserStatus(userID: number, enabled: boolean) {
    enabled = !enabled;
    this.usersService.updateUserEnabledStatus(userID, enabled).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: () => {
        // Update the user's status in the local data
        this.usersPage$ = this.usersPage$.pipe(
          map(userPage => {
            const modifiedUsers = userPage.userDTOS.map(user => {
              if (user.id === userID) {
                return { ...user, enabled }; // Update the user's enabled status
              }
              return user;
            });
            return { ...userPage, userDTOS: modifiedUsers }; // Return updated userPage
          })
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

}
