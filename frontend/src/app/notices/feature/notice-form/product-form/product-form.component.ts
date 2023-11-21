import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  categories = ['cpu', 'gpu', 'mobo'  ]; 
  conditions = ['new', 'used', 'broke'  ]; 

  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }
 
  productForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    price: new FormControl(null, [
      Validators.required,
    ]),
    hasReceipt: new FormControl(''),
    warranty: new FormControl(''),
    categoryId: new FormControl('', [
      Validators.required,
    ]),
    condition: new FormControl('', [
      Validators.required,
    ]),
    images: new FormControl([], [
      Validators.required,
      Validators.minLength(1)
    ]),
  })

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
