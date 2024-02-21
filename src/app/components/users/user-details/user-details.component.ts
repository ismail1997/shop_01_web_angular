import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public user !: Observable<User>;
  public id!: number;
  public imageToShow: any;
  private unsubscribe$ = new Subject<void>();


  constructor(private userService: UsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.user = this.userService.getOneUser(this.id);
    this.getImageFromService();
  }
  ngOnDestroy(): void {
    this.imageToShow = null;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getImageFromService(): void {
    const userId = this.id; // Replace with the actual user ID
    this.userService.getImageOfUser(userId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      data => {
        this.createImageFromBlob(data);
      },
      error => {
        console.error(error);
      }
    );
  }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
