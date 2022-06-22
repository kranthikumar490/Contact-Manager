import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './groups/groups.component';
import { GroupContactsComponent } from './group-contacts/group-contacts.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CanActivateRouteGuard } from './shared/canActivateRouteGuard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'groups',
    canActivate: [CanActivateRouteGuard],
    component: GroupsComponent,
  },
  {
    path: 'groups/:id',
    canActivate: [CanActivateRouteGuard],
    component: GroupContactsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
