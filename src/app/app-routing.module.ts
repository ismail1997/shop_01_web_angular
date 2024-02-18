import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/admin-template/admin-template.component';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';

const routes: Routes = [
  {path:"" , redirectTo:"/admin" , pathMatch:"full"},
  {
    path:"admin" , component:AdminTemplateComponent, children:
    [
      {path:"users" , component:UsersComponent},
      {path:"roles", component:RolesComponent},
      {path:"user-details/:id", component: UserDetailsComponent},
      {path:"create-user", component:CreateUserComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
