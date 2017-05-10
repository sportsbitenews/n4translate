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

import { environment } from '../../environments/environment';

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

  login(credentials): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/authenticate`, credentials)
      .map(res => res.json())
      .map((data) => {
        let user: User = <User>pick(data, ['$loki', 'email', 'admin', 'meta', 'projects']);
        localStorage.setItem('token', data.token);
        this.pubsub.loggedIn.subject.next(user);
        this.router.navigateByUrl('/projects');
      });
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getLoggedInFromBackend(): Observable<any> {
    return this.authHttp.get(`${environment.apiUrl}/api/authenticated`)
      .map(res => res.json());
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('');
  }

}
