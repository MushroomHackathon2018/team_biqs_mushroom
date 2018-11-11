import { FaceComponent } from './components/face.component';
import { UserInfoService } from './services/user-info.service';
import { CourseService } from './services/course.service';
import { LoginComponent } from './components/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UiComponentComponent } from './components/ui-component.component';
import { SectionTitleComponent } from './components/sections/section-title.component';
import { SectionFloorComponent } from './components/sections/section-floor.component';
import { SectionSceneComponent } from './components/sections/section-scene.component';
import { SectionInfoComponent } from './components/sections/section-info.component';
import { TrainComponent } from './components/train.component';

import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';


/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UiComponentComponent,
    SectionTitleComponent,
    SectionFloorComponent,
    SectionSceneComponent,
    SectionInfoComponent,
    TrainComponent,
    FaceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule
  ],
  providers: [
    CourseService,
    UserInfoService,
    { provide: NZ_I18N, useValue: zh_CN } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
