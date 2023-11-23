import { Component, Input} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { getCategories } from '@app/categories/data-access/store/categories.selectors';
import { Condition } from '@app/shared/models/condition.model';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent{
  categories$ = this.store.select(getCategories);
  conditions = Object.values(Condition).filter(value => isNaN(Number(value))); 
  disableSubmitButton = false;
  editMode = true;
  @Input( { required: true }) productForm!: FormGroup;

  
  constructor(private store: Store, private formBuilder: FormBuilder) {}
  
  addImage() {
    this.imagesFormArray.push(this.formBuilder.group({ url: ''}));
    console.log(this.productForm);
  }
  
  isRemovable() { return this.imagesFormArray.length > 1; }
  
  removeImage(pos: number) {
    this.imagesFormArray.removeAt(pos);
    this.imagesFormArray.updateValueAndValidity();
  }
  
  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }
    
    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }
  
  get nameFormControl() { return this.productForm.get('name') as FormControl; }
  get priceFormControl() { return this.productForm.get('price') as FormControl; }
  get hasReceiptFormControl() { return this.productForm.get('hasReceipt') as FormControl; }
  get warrantyFormControl() { return this.productForm.get('warranty') as FormControl; }
  get categoryIdFormControl() { return this.productForm.get('categoryId') as FormControl; }
  get conditionFormControl() { return this.productForm.get('condition') as FormControl; }
  get imagesFormArray() { return this.productForm.get('imageRequests') as FormArray; }
}
