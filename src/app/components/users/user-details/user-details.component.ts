import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { environments } from '../../../environment/environment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public user :User | undefined ;
  public id!: number;
 
  private unsubscribe$ = new Subject<void>();
  public usersHost : string = environments.HOST+environments.USERS_ENDPOINT;

  constructor(private userService: UsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.userService.getOneUser(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        this.user=data;
      },
      error:err=>{
        console.log(err);
      }
    });
 
  }
  ngOnDestroy(): void {
 
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

 
 

}
