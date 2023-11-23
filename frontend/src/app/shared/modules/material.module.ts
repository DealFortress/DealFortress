import { NgModule } from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {MatSelectModule} from "@angular/material/select"
import {MatSnackBarModule} from "@angular/material/snack-bar"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    exports:[
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule,
        MatCheckboxModule
    ]
})
export class MaterialModule{}