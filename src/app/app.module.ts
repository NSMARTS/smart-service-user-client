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
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule,
    HttpClientModule,
    /**
     * @작성자 임호균
     * @작성일 2023-08-25
     * @description @angular0/angular-jwt의 경우 local storage에 저장된 토큰을 찾아서 요청이 있을 경우 자동으로 http 신호의 header에 포함하여 신호를 준다
     * 필수 항목
     * 1. tokenGetter : local storage의 어떤 값을 jwt token으로 인식하고 사용할지 결정한다
     * 2. allowedDomains : 어떤 요청들에 jwt token이 포함된 header를 보낼지 결정한다
     * 3. disallowedRoutes : 로그인이나, 회원가입 같이 jwt token이 필요 없는 요청들이 있을 경우(예외 사항이 있을 경우) 따로 지정해 준다
     * @reference https://www.npmjs.com/package/@auth0/angular-jwt
     */
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:3000", "192.168.0.5:3000"],
        disallowedRoutes: [
          '/api/v1/auth/sign-in',
          '/api/v1/auth/sign-up',
        ]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
