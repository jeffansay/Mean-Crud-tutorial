import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

domain ="http://localhost:3000";
authToken;
user;
options;

  createAuthenicationHeaders() {
      this.loadToken();
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json',
          'authorization': this.authToken
        })
      });
  }

  loadToken() {
      const token = localStorage.getItem('token');
      this.authToken = token;
  }

  constructor(
    private _http: Http
  ) { }

  registerUser(user){
    return this._http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this._http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this._http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }


  // Function to login user
   login(user) {
     return this._http.post(this.domain + '/authentication/login', user).map(res => res.json());
   }

  // Function to store user's data in client local storage
   storeUserData(token, user) {
     localStorage.setItem('token', token); // Set token in local storage
     localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
     this.authToken = token; // Assign token to be used elsewhere
     this.user = user; // Set user to be used elsewhere
   }

   getProfile(){
     this.createAuthenicationHeaders();
     return this._http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
   }

}
