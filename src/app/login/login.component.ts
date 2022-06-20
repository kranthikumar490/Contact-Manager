import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    })
  }

  login(){
    this.http.post<any>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDyg0QrEJK7X1Z6F1YTObRXYnM0dfn-9qM", {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      returnSecureToken: true
    }).subscribe(res=>{
      this.loginForm.reset();
      this.router.navigate(['groups'])
    }, err =>{
      alert('Something went wrong')
    })
  }

}
