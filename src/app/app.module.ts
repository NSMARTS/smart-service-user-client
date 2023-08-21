import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsModule } from './materials/materials.module';
import { SpaceComponent } from './pages/space/space.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { FindPasswordComponent } from './pages/auth/find-password/find-password.component';
import { CreateSpaceDialogComponent } from './components/dialog/create-space-dialog/create-space-dialog.component';
import { ProgressDialogComponent } from './components/dialog/progress-dialog/progress-dialog.component';
import { PositiveDialogComponent } from './components/dialog/positive-dialog/positive-dialog.component';
import { NegativeDialogComponent } from './components/dialog/negative-dialog/negative-dialog.component';
import { MainComponent } from './pages/main/main.component';
import { IndexComponent } from './pages/index/index.component';

@NgModule({
  declarations: [
    AppComponent,
    SpaceComponent,
    ProfileEditComponent,
    SignInComponent,
    FindPasswordComponent,
    CreateSpaceDialogComponent,
    ProgressDialogComponent,
    PositiveDialogComponent,
    NegativeDialogComponent,
    MainComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
