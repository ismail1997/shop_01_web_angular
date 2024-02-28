import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CategoriesService } from '../../../services/categories.service';
import { BrandsService } from '../../../services/brands.service';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../models/category.model';
import { Brand } from '../../../models/brand.model';
import { Subject, takeUntil } from 'rxjs';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit, OnDestroy {



  private unsubscribe$ = new Subject<void>();

  public product: Product = {
    id: 0,
    name: '',
    alias: '',
    shortDescription: '',
    fullDescription: '',
    createdTime: new Date(),
    updatedTime: new Date(),
    enabled: false,
    inStock: false,
    cost: 0,
    price: 0,
    discountPercent: 0,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    mainImage: '',
    category: { id: 0, name: '', image: '', enabled: false, alias: '' },
    brand: { id: 0, name: '', logo: '' }

  };
  public categories!: Array<Category>;
  public brands!: Array<Brand>;

  public selectedBrand: Brand | undefined;
  public selectedCategory!: Category | undefined;

  public shortDescription!: string;
  public fullDescription!: string;


  public createProductFormGroup!: FormGroup;





  constructor(
    private categoryService: CategoriesService,
    private brandService: BrandsService,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private router : Router
  ) { }


  ngOnInit(): void {
    this.initBrands();
    this.createForm();
    this.addDetail();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initBrands() {
    this.brandService.getAllBrands().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        this.brands = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }


  onBrandSelected(event: any) {
    this.createProductFormGroup.patchValue({
      category: undefined // Or whatever initial value you want to set for the category FormControl
    });
    let id: number = event.target.value;
    this.brandService.getCategoriesOfBrand(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        this.categories = data;
        console.log(this.categories);
      },
      error: err => {
        console.log(err);
      }
    })
  }


  createForm() {
    this.createProductFormGroup = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(233)]],
      alias: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(233)]],
      shortDescription: [null, [Validators.required, Validators.minLength(20), Validators.maxLength(512)]],
      fullDescription: [null, [Validators.maxLength(4096)]],
      enabled: [false, []],
      inStock: [false, []],
      cost: [0, [Validators.required]],
      price: [0, [Validators.required]],
      discountPercent: [0, []],
      length: [0, []],
      width: [0, []],
      height: [0, []],
      weight: [0, []],
      mainImage: [null, []],
      category: [undefined, []],
      brand: [undefined, [Validators.required]],
      details: this.formBuilder.array([]), // Prepopulate with two pairs,
      images: this.formBuilder.array([])
    });
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    this.shortDescription = event.editor.getSemanticHTML();
  }

  changeEditorForFullTextEditor(event: EditorChangeContent | EditorChangeSelection) {
    this.fullDescription = event.editor.getSemanticHTML();
  }

 



  get details() {
    return this.createProductFormGroup.get('details') as FormArray;
  }

  deleteItem(index: number) {
    this.details.removeAt(index);
  }

  addDetail() {
    this.details.push(this.formBuilder.group({
      name: [''],
      value: ['']
    }));
  }

  get extraImages() {
    return this.createProductFormGroup.get('images') as FormArray;
  }

  deleteImage(index: number) {
    this.extraImages.removeAt(index);
    this.productImages.splice(index, 1);
    this.imagesPreview.splice(index, 1);
  }

  addImage() {
    this.extraImages.push(this.formBuilder.group({
      extraImage: [null],
    }))
  }





  /*
      This part is to handle main images and extra iamges 
  */
  // Property to store the selected image file
  selectedImageFile: File | null = null;
  // Property to store the image preview URL
  mainImagePreveiw: string | ArrayBuffer | null = null;

  maxSizeInBytes: number = 500 * 1024; // 500 KB
  errorMessageForMainImage: string | null = null;

  onMainImageSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      if (file.size > this.maxSizeInBytes) {
        this.errorMessageForMainImage = 'File size exceeds the limit (500 KB).';
        // Clear the input value to allow selecting a new file
        inputElement.value = '';
      } else {
        this.errorMessageForMainImage = null;
        this.selectedImageFile = file;
        // Proceed with generating image preview
        this.generateMainImagePreview(file);
      }
    }
  }

  generateMainImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.mainImagePreveiw = reader.result;
    };
    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  }

  // handle extra images : 
  productImages: File[] = [];
  imagesPreview: any[] = [];
  onFileChange(event: any, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      if (file) {

        if (file.size > this.maxSizeInBytes) {
          alert('File size exceeds 500KB');
          // Clear the file input
          this.extraImages.at(index).reset();
          console.log("existed")
          inputElement.value = '';
          return;
        }
        console.log("not existed")
        this.productImages[index] = file;

        for (var i = 0; i < this.productImages.length; i++) {
          this.generateImagesPreview(this.productImages[i], i);
        }
      }
    }

  }

  generateImagesPreview(file: File, index: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagesPreview[index] = reader.result;
    };
    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  }


  handleCreateProduct() {

    let productFormData = this.createProductFormGroup.value;
    let { images: _, ...product } = productFormData;

    let idOfBrand: number = this.createProductFormGroup.value.brand;
    let idOfCategory: number = this.createProductFormGroup.value.category;


    this.selectedBrand = this.brands.find(br => br.id == idOfBrand);
    this.selectedCategory = this.categories.find(cat => cat.id == idOfCategory);

    if (this.selectedBrand) {
      product.brand = this.selectedBrand;
    }

    if (this.selectedCategory) {
      product.category = this.selectedCategory;
    }


    let imageNames = this.productImages.map((file, index) => {
      return {
        name: file.name
      };
    });
    if (imageNames.length > 0) { //set the extra images of product 
      product.images = imageNames;
    }


    this.product = product;

    if (this.selectedImageFile) { //set the name of main image for the product if it existed
      this.product.mainImage = this.selectedImageFile?.name;
    }

    console.log(this.product);

    //now we should perform a post method 

    this.submitProduct(product);

    
  }
  submitProduct(product: Product) {
    this.productService.createProduct(product).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next:data=>{
        console.log("the id of product is this : "+data.id);
        //now we should upload main image and extras images 
        const mainImageFormData = new  FormData();
        if(this.selectedImageFile){
          mainImageFormData.append("image",this.selectedImageFile);
        }

        this.productService.uploadProductMainImage(data.id,mainImageFormData).pipe(takeUntil(this.unsubscribe$)).subscribe({
          next:data=>{
            console.log(data);
          },
          error:err=>{
            console.log(err)
          }
        })

        this.productService.uploadProductExtrasImages(data.id,this.productImages).pipe(takeUntil(this.unsubscribe$)).subscribe({
          next:data=>{
            console.log(data);
          },
          error:err=>{
            console.log(err)
          }
        })
      },
      error:error=>{
        console.log(error)
      },
      complete:()=>this.router.navigateByUrl("/admin/products?message=Product%20Created%20Successfully")
    })
  }


  goBackToProductsPage(){
    this.router.navigateByUrl("/admin/products")
  }
}



