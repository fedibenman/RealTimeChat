import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

  @Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
  })

export class RegisterComponent implements OnInit {
  form: any = {
    firstName: null,
    lastName:null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  passwordMatchError: boolean = false;


  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.password !== this.form.confirmPassword) {
      this.passwordMatchError = true;
      this.errorMessage = "password confirmation wrong";
      this.isSignUpFailed = true;
      return;
    }
    const { firstName,lastName, email, password } = this.form;
    this.authService.register(firstName,lastName, email, password).subscribe({
      next: (data:any) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err:any) => {
        console.error(err) ;
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
