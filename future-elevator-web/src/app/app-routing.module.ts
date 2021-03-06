import { TrainComponent } from './components/train.component';
import { LoginComponent } from './components/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiComponentComponent } from './components/ui-component.component';
import { FaceComponent } from './components/face.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'ui',
    component: UiComponentComponent
  },
  {
    path: 'train',
    component: TrainComponent
  },
  {
    path: 'face',
    component: FaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
