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
import { ProductsComponent } from './components/products/products.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';

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
      {path:"brands", component:BrandsComponent},

      {path:"products", component:ProductsComponent},
      {path:"create-product", component:CreateProductComponent},
      {path:"product-details/:id", component:ProductDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
