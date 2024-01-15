import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const ipAdress = environment.ipAdress ; 
const protocal = environment.protocol ; 
const AUTH_API = `${protocal}://${ipAdress}:8080/api/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(firstName: string,lastName:string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        firstName,
        lastName,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }

  refreshToken() {
    return this.http.post(AUTH_API + 'refreshtoken', { }, httpOptions);
  }

  sendEmail(email:string){
    return this.http.post(AUTH_API+'sendEmail' , {email}  , httpOptions) ; 

  }

  resetPassword(password:string , token:string){

  return this.http.post(AUTH_API+'resetPassword' , {password, token} , httpOptions) ; 
  }
}
