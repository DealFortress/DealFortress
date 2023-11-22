import { Component, OnDestroy, OnInit} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NoticeRequest } from '@app/shared/models/notice-request.model';
import { AuthService} from '@auth0/auth0-angular';
import { Router } from '@angular/router'
import { Store } from '@ngrx/store';
import { getUserLatestNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { postNoticeRequest } from '@app/notices/data-access/store/notices.actions';
import { getUser, getUserId } from '@app/users/data-access/store/users.selectors';
import { ShowAlert } from '@app/shared/store/app.actions';
import { of } from 'rxjs';
import { getCategories } from '@app/categories/data-access/store/categories.selectors';
import { Product } from '@app/shared/models/product.model';
import { ProductRequest } from '@app/shared/models/product-request.model';

@Component({
  selector: 'app-notice-form',
  templateUrl: './notice-form.component.html',
  styleUrls: ['./notice-form.component.css'],
})
export class NoticeFormComponent implements OnInit{
  deliveryMethods = ['postage', 'hand delivery', 'pick up'  ];  
  payments = ['cash', 'bank transfer', 'swish'];
  noticeForm: FormGroup;
  isAuthenticated$ = this.authService.isAuthenticated$;
  disableSubmitButton = false;
  
  private creatorId? : number;  

  constructor(
    public authService: AuthService, 
    private store: Store, 
    private router: Router, 
    private formBuilder: FormBuilder
    ) {
    
    this.noticeForm = this.noticeFormGroup

    if (!this.isAuthenticated$) {
      this.authService.loginWithPopup()
    }
  }
  ngOnInit(): void {
    this.store.select(getUserId).subscribe(id => this.creatorId = id)
  }

  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }



  addProduct() {
    this.productsFormArray.push(this.formBuilder.group({ url: ''}));
  }

  isRemovable() {
    return this.productsFormArray.length > 1;
  }

  removeProduct(pos: number) {
    this.productsFormArray.removeAt(pos);
    this.productsFormArray.updateValueAndValidity();
  }

  async onSubmit() {
    this.disableSubmitForNSecond(1);  
    
    if (this.noticeForm.invalid ||!this.creatorId) {
      of(ShowAlert({message: 'Apologies squire there seem to be an issue at the portcullis, try refreshing', actionresult: 'fail'}))
      return;
    }    

    const postRequest = this.createRequest(this.creatorId);

    this.store.dispatch(postNoticeRequest(postRequest));

    this.navigateToNewNotice()
  }


  disableSubmitForNSecond(n : number)  {
    this.disableSubmitButton = true;
    setTimeout(() => (this.disableSubmitButton = false), n*1000);
  }

  createRequest(creatorId: number) {

    const postRequest : NoticeRequest = this.noticeForm.value as NoticeRequest;
      
    postRequest.userId = creatorId; 
  

    return postRequest
  }

  navigateToNewNotice() {
    this.store.select(getUserLatestNoticeId).subscribe(id => {
      if (id) {
        this.router.navigate(['notices/', id]);
      }
    })
  } 

  
  get titleFormControl() {
    return this.noticeForm.get('title') as FormControl;
  }
  get descriptionFormControl() {
    return this.noticeForm.get('description') as FormControl;
  }
  get cityFormControl() {
    return this.noticeForm.get('city') as FormControl;
  }
  get paymentsFormControl() {
    return this.noticeForm.get('payments') as FormControl;
  }
  get deliveryMethodsFormControl() {
    return this.noticeForm.get('deliveryMethods') as FormControl;
  }
  get productsFormArray() {
    return this.noticeForm.get('products') as FormArray;
  }
  
  noticeFormGroup = new FormGroup({
    userId: new FormControl(),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(30)
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    payments: new FormControl([''], [
      Validators.required,
      Validators.minLength(1)
    ]),
    deliveryMethods: new FormControl([''], [
      Validators.required,
      Validators.minLength(1)
    ]),
    products: new FormArray([
      this.formBuilder.group({
        name: '',
        price: -1,
        hasReceipt: false,
        warranty: '',
        categoryId: -1,
        condition: '',
        images: [],
        })
     ], 
     [Validators.required, Validators.minLength(1)]),
  });
}