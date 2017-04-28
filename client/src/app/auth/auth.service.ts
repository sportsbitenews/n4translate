import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { forOwn } from "lodash";

interface Commander {
  [x: string]: {
    subject: Subject<any>;
    observable?: Observable<any>;
  }
}

@Injectable()
export class AuthService {
  public commander: Commander  = {
    loggedIn: {
      subject: new Subject<boolean>()
    }
  }

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private router: Router
  ) {
    this.init();
  }

  init() {
    forOwn(this.commander, (relay) => {
      relay.observable = relay.subject.asObservable().share();
    });
  }

  login(credentials) {
    return this.http.post('http://localhost:3000/api/authenticate', credentials)
      .map(res => res.json())
      .subscribe(
        (data) => {
          // this.commander.loggedIn.subject.next(true);
          console.log('response', data);
          localStorage.setItem('token', data.token);
          this.router.navigateByUrl('/projects');
        },
        error => console.log(error)
      );
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getLoggedInFromBackend(): Observable<any> {
    return this.authHttp.get('http://localhost:3000/api/authenticated')
      .map(res => res.json());
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('');
  }

}
