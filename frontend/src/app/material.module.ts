import { NgModule } from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {MatSelectModule} from "@angular/material/select"
import {MatSnackBarModule} from "@angular/material/snack-bar"
import { ReactiveFormsModule } from "@angular/forms";
import {MatButtonModule} from "@angular/material/button"
import {MatCardModule} from "@angular/material/card"
import {MatToolbarModule} from "@angular/material/toolbar"
import {MatMenuModule} from "@angular/material/menu"
import {MatIconModule} from "@angular/material/icon"
import {MatDialogModule} from "@angular/material/dialog"
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner"

@NgModule({
    exports:[
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule,
        // MatButtonModule,
        // MatCardModule,
        // MatToolbarModule,
        // MatIconModule,
        // MatMenuModule,
        // MatDialogModule,
        // MatProgressSpinnerModule
    ]
})
export class MaterialModule{}