import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsModule } from './materials/materials.module';
import { SpaceComponent } from './pages/space/space.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { CreateSpaceDialogComponent } from './components/dialog/create-space-dialog/create-space-dialog.component';
import { MainComponent } from './pages/main/main.component';
import { IndexComponent } from './pages/index/index.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';


// Config
import { ENV } from './config/config';

export function tokenGetter() {
	return localStorage.getItem(ENV.tokenName);
}
@NgModule({
  declarations: [
    AppComponent,
    SpaceComponent,
    ProfileEditComponent,
    CreateSpaceDialogComponent,
    MainComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        disallowedRoutes: [
          '/api/v1/auth/sign-in',
          '/api/v1/auth/sign-up',
        ]
      }
    }),
  ],
  providers: [JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
