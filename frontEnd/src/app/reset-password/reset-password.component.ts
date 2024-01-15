import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { Router , ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public sendEmail :string   = "Send Email";
  token!:string ; 
  form: any = {
    username: null,
  };
  isLoggedIn:any ; 
    constructor(private storageService : StorageService ,private authService: AuthService,private route: ActivatedRoute , private router: Router) { }
    
    ngOnInit(): void {
      if (this.storageService.isLoggedIn()) {
        this.isLoggedIn = true;
        // this.roles = this.storageService.getUser().roles;
      }
      if(this.route.snapshot.paramMap.get('token')!=null){
        this.token = this.route.snapshot.paramMap.get('token')!;  
      
      } 
      else{
        // change route to unfound page
        this.router.navigate(['/404']);
      }
      console.log(this.token) ; 
    }
  
  
    onSubmit(){
      const { password } = this.form;
      this.sendEmail = "Resend Email" ; 
//get the token from the url 
      
      this.authService.resetPassword(password , this.token).subscribe({
        next: (data:any) => {
        console.log(data)  ;   
        },
        error: (err:any) => {
  console.error(err) ; 
  
        }
      })
    }




  
}
