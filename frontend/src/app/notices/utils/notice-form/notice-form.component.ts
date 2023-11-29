import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NoticeRequest } from '@app/shared/models/notice-request.model';
import { AuthService} from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import {getUserId } from '@app/users/data-access/store/users.selectors';
import { ShowAlert } from '@app/shared/store/app.actions';
import { of } from 'rxjs';
import { SoldStatus } from '@app/shared/models/sold-status.model';


@Component({
  selector: 'app-notice-form',
  templateUrl: './notice-form.component.html',
  styleUrls: ['./notice-form.component.css'],
})
export class NoticeFormComponent implements OnInit{
  public deliveryMethods = ['Postage', 'Hand-delivery', 'Pick-up'  ];  
  public payments = ['Cash', 'Bank transfer', 'Swish'];
  public noticeForm: FormGroup;
  public isAuthenticated$ = this.authService.isAuthenticated$;
  public disableSubmitButton = false;
  private creatorId? : number;  
  @Input() prefilledFormGroup?: FormGroup;
  @Output() requestEvent = new EventEmitter<NoticeRequest>();

  constructor(public authService: AuthService, private store: Store, private formBuilder: FormBuilder) {
    this.noticeForm = this.noticeFormGroup

    if (!this.isAuthenticated$) {
      this.authService.loginWithPopup()
    }
  }

  ngOnInit(): void {
    this.store.select(getUserId).subscribe(id => this.creatorId = id)

    window.scroll({
      top: 0,
      left: 0
    });

    if (this.prefilledFormGroup != null) {
      this.noticeForm = this.prefilledFormGroup
    }
  }

  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }

 
  addProduct() {
    this.productsFormArray.push(this.formBuilder.group(
      {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      SoldStatus: [SoldStatus.Available],
      isSoldSeparately: [false],
      hasReceipt: [false],
      warranty: [''],
      categoryId: [0],
      condition: [0],
      imageRequests: this.formBuilder.array([
        this.formBuilder.group({
          url: ['', [Validators.required]]
        })
      ]),
      }
    ));
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

    this.requestEvent.emit(postRequest);
  }


  disableSubmitForNSecond(n : number)  {
    this.disableSubmitButton = true;
    setTimeout(() => (this.disableSubmitButton = false), n*1000);
  }

  createRequest(creatorId: number) {
    const postRequest : NoticeRequest = this.noticeForm.value as NoticeRequest;  
    postRequest.userId = creatorId; 

    console.log(postRequest);

    return postRequest
  }


  getProductFormGroup(index: number) {
    return this.productsFormArray.get(`${index}`) as FormGroup
  }

  noticeFormGroup = this.formBuilder.group({
    userId: [],
    title: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(30)]],
    city: ['', [Validators.required, Validators.minLength(1)]],
    payments: [[''], [Validators.required, Validators.minLength(1)]],
    deliveryMethods: [[''], [Validators.required, Validators.minLength(1)]],
    productRequests: this.formBuilder.array([
      this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        price: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
        soldStatus: [SoldStatus.Available],
        isSoldSeparately: [false],
        hasReceipt: [false],
        warranty: [''],
        categoryId: [0],
        condition: [0],
        imageRequests: this.formBuilder.array([
          this.formBuilder.group({
            url: ['', [Validators.required]]
          })
        ], [Validators.required, Validators.minLength(1)]),  
      })
    ], [Validators.required, Validators.minLength(1)])
  });

  get titleFormControl() { return this.noticeForm.get('title') as FormControl; }
  get descriptionFormControl() { return this.noticeForm.get('description') as FormControl; }
  get cityFormControl() { return this.noticeForm.get('city') as FormControl; }
  get paymentsFormControl() { return this.noticeForm.get('payments') as FormControl; }
  get deliveryMethodsFormControl() { return this.noticeForm.get('deliveryMethods') as FormControl; }
  get productsFormArray() { return this.noticeForm.get('productRequests') as FormArray; }
  
}