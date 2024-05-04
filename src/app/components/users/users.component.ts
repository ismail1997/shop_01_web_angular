import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { UserPage } from '../../models/userpage.model';
import { environments } from '../../environment/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {





  public usersPage$ !: Observable<UserPage>;
  public currentPage: number = 0;
  public pageSize: number = 10;

  public usersHost:string = environments.HOST+environments.USERS_ENDPOINT;

  

  public message: string | null = null;

  private unsubscribe$ = new Subject<void>();


  public clock_tick :number | undefined ;

  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getUsers();
    this.showMessageOfCreation();

    this.clock_tick= new Date().getTime();
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
     
 
  }

 
  refreshView(): void {
    this.cdr.detectChanges();
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
  
  onEditUser(userID: number) {
    // Navigate to edit user component with query parameter to indicate refresh is needed
    this.router.navigateByUrl(`/admin/edit-user/${userID}`);

  }


  showConfirmationModal = false;
  userIdToDelete: number | null = null;


  openConfirmationDeleteModal(userId: number): void {
    this.showConfirmationModal = true;
    this.userIdToDelete = userId;
  }
  deleteUser(): void {
    // Perform deletion logic using this.userIdToDelete
    // Example: this.usersService.deleteUser(this.userIdToDelete);
    this.closeConfirmationModal();
  }

  cancelDelete(): void {
    this.closeConfirmationModal();
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.userIdToDelete = null;
  }
}
