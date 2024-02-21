import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  public product!:Product;
}
