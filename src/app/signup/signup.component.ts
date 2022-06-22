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
      password: ['', [Validators.required, this.passwordValidation]],
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
          this.http
            .post(
              'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/users.json',
              {
                firstname: this.signupForm.value.firstname,
                lastname: this.signupForm.value.lastname,
                aadhar: this.signupForm.value.aadhar,
                email: this.signupForm.value.email,
              }
            )
            .subscribe((res) => {
              alert('Signup successfully');
              this.signupForm.reset();
              this.router.navigate(['login']);
            });
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

  passwordValidation(control: AbstractControl) {
    var regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/;
    if (!regex.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }
}
