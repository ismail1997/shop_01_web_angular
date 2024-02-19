import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/admin-template/admin-template.component';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BrandsComponent } from './components/brands/brands.component';
import { CreateRoleComponent } from './components/roles/create-role/create-role.component';

const routes: Routes = [
  {path:"" , redirectTo:"/admin" , pathMatch:"full"},
  {
    path:"admin" , component:AdminTemplateComponent, children:
    [
      {path:"users" , component:UsersComponent},
      {path:"user-details/:id", component: UserDetailsComponent},
      {path:"create-user", component:CreateUserComponent},

      {path:"roles", component:RolesComponent},
      {path:"create-role",component:CreateRoleComponent},

      {path:"categories",component:CategoriesComponent},
      {path:"brands", component:BrandsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
