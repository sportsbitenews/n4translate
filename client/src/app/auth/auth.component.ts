import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';

interface Credentials {
  email?: string,
  password?: string
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {

  credentials: Credentials = {};
  showUnauthorizedMessage = '';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    
  }

  login() {
    this.auth.login(this.credentials)
    .subscribe(
      (data) => {
        this.showUnauthorizedMessage = '';
      },
      (error) => {
        this.showUnauthorizedMessage = 'Email and password are not matched.';
        console.log(error)
      }
    );
  }

  getLoggedInFromBackend() {
    this.auth.getLoggedInFromBackend()
    .subscribe(
      (data) => {
        console.log('/api/authenticated : response', data);
        this.credentials = {};
      },
      error => console.log(error)
    );
  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

  logout() {
    this.auth.logout();
  }
}
