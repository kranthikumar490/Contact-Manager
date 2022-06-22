import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateRouteGuard implements CanActivate {
  constructor(private auth: ApiService, private router: Router) {}
  canActivate() {
    if (this.auth.isUserLoggedIn()) {
      return true;
    } else {
      window.alert("You don't have permission to view this page");
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
