import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-forgot-passwrd',
  templateUrl: './forgot-passwrd.component.html',
  styleUrls: ['./forgot-passwrd.component.css']
})
export class ForgotPasswrdComponent implements OnInit {
public sendEmail :string   = "Send Email";
form: any = {
  email: null,
};
isLoggedIn:any ; 
  constructor(private storageService : StorageService ,private authService: AuthService) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // this.roles = this.storageService.getUser().roles;
    }
  }


  onSubmit(){
    const { email } = this.form;
    this.sendEmail = "Resend Email" ; 
    this.authService.sendEmail(email).subscribe({
      next: data => {
      console.log("email have been sent") ; 
      console.log(data)  ;   
      },
      error: err => {
console.log("sending email failed");
console.error(err) ; 

      }
    })
  }



}
