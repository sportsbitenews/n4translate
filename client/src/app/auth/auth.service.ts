import { User } from '../user/user.interface';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { forOwn, pick } from "lodash";

interface Pubsub {
  [x: string]: {
    subject: Subject<any>;
    observable?: Observable<any>;
  }
}

@Injectable()
export class AuthService {
  public pubsub: Pubsub  = {
    loggedIn: {
      subject: new Subject<User>()
    }
  }

  private domain: string = 'http://localhost:3000';

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private router: Router
  ) {
    this.init();
  }

  init() {
    forOwn(this.pubsub, (relay) => {
      relay.observable = relay.subject.asObservable().share();
    });
  }

  login(credentials) {
    return this.http.post(`${this.domain}/api/authenticate`, credentials)
      .map(res => res.json())
      .subscribe(
        (data) => {
          let user: User = <User>pick(data, ['$loki', 'email', 'admin']);
          localStorage.setItem('token', data.token);
          this.pubsub.loggedIn.subject.next(user);
          this.router.navigateByUrl('/projects');
        },
        error => console.log(error)
      );
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getLoggedInFromBackend(): Observable<any> {
    return this.authHttp.get(`${this.domain}/api/authenticated`)
      .map(res => res.json());
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('');
  }

}
