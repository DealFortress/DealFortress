import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getCategories } from '@app/categories/data-access/store/categories.selectors';
import { ProductRequest } from '@app/shared/models/product-request.model';
import { ShowAlert } from '@app/shared/store/app.actions';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent{
  categories$ = this.store.select(getCategories);
  conditions = ['new', 'used', 'broke'  ]; 
  disableSubmitButton = false;
  
  constructor(private store: Store, private formBuilder: FormBuilder) {}
  
  productForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    price: new FormControl([
      Validators.required,
    ]),
    hasReceipt: new FormControl(false),
    warranty: new FormControl(''),
    categoryId: new FormControl(0, [
      Validators.required,
    ]),
    condition: new FormControl('', [
      Validators.required,
    ]),
    images: this.formBuilder.array([])
  })

  getImages() {
    console.log((<FormArray>this.productForm.get('images')).controls);
    return (<FormArray>this.productForm.get('images')).controls;
  }

  imageValue(image: any) {
    return image.controls.value.value;
  }

  createImage(name?: string): FormGroup {
    return this.formBuilder.group({
      value: name ? name : ''
    });
  }

  removeImage(index: number) {
    const images = this.productForm.get('images') as FormArray;
    images.removeAt(index);
  }

  addImage(name?: string): void {
    const images = this.productForm.get('images') as FormArray;
    images.push(this.createImage(name));
  }

  @Output() productEvent = new EventEmitter<ProductRequest>();


  async onSubmit() {
    this.disableSubmitForNSecond(1);  

    console.log(this.productForm);
    
    if (this.productForm.invalid) {
      of(ShowAlert({message: 'Apologies squire there seem to be an issue at the portcullis, try refreshing', actionresult: 'fail'}))
      return;
    }    

    // this.productEvent.emit(this.productForm.value as ProductRequest)

    // const postRequest = this.createRequest(this.creatorId);

    // this.store.dispatch(postNoticeRequest(postRequest));
  }

  disableSubmitForNSecond(n : number)  {
    this.disableSubmitButton = true;
    setTimeout(() => (this.disableSubmitButton = false), n*1000);
  }


  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }

  get nameFormControl() {
    return this.productForm.get('name') as FormControl;
  }
  get priceFormControl() {
    return this.productForm.get('price') as FormControl;
  }
  get hasReceiptFormControl() {
    return this.productForm.get('hasReceipt') as FormControl;
  }
  get warrantyFormControl() {
    return this.productForm.get('warranty') as FormControl;
  }
  get categoryIdFormControl() {
    return this.productForm.get('categoryId') as FormControl;
  }
  get conditionFormControl() {
    return this.productForm.get('condition') as FormControl;
  }
  get imagesFormControl() {
    return this.productForm.get('images') as FormControl;
  }

}
