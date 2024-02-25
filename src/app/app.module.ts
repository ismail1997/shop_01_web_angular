import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AdminTemplateComponent } from './components/admin-template/admin-template.component';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { BrandsComponent } from './components/brands/brands.component';
import { CreateRoleComponent } from './components/roles/create-role/create-role.component';
import { ProductsComponent } from './components/products/products.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    RolesComponent,
    NavigationComponent,
    AdminTemplateComponent,
    UserDetailsComponent,
    CreateUserComponent,
    CategoriesComponent,
    CapitalizePipe,
    BrandsComponent,
    CreateRoleComponent,
    ProductsComponent,
    CreateProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
