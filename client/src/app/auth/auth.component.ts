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

  constructor(private auth: AuthService) { }

  ngOnInit() {
    // this.auth.commander.loggedIn.observable
    // .subscribe((value) => {
    //   console.log('loggedIn', value);
    // });
  }

  login() {
    this.auth.login(this.credentials);
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
