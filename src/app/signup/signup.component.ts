import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EMAIL_DOMAIN } from '../constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public signupForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      aadhar: ['', Validators.required],
      email: ['', [Validators.required, this.validateEmailDomain]],
      password: ['', Validators.required],
    });
  }

  signUp() {
    this.http
      .post<any>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDyg0QrEJK7X1Z6F1YTObRXYnM0dfn-9qM',
        {
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          returnSecureToken: true,
        }
      )
      .subscribe(
        (res) => {
          alert('Signup successfully');
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        (err) => {
          alert('something went wrong');
        }
      );
  }

  validateEmailDomain(control: AbstractControl) {
    var regex = new RegExp(
      '^[a-z0-9](.?[a-z0-9]){5,}@' + EMAIL_DOMAIN + '$',
      'g'
    );
    if (!regex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }
}
