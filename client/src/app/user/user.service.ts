import { Injectable } from '@angular/core';
import { User } from './user.interface';

import { AuthService } from '../auth/auth.service';
import { AuthHttp } from 'angular2-jwt';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { get } from "lodash";

@Injectable()
export class UserService {
  private domain: string = 'http://localhost:3000';

  private user: User;
  private users: User[];

  public usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable().share();

  constructor(private auth: AuthService, private authHttp: AuthHttp) {
    this.init();
  }

  init() {
    if(this.auth.loggedIn()) {
      this.authHttp.get(`${this.domain}/api/user/instance`)
      .map(res => res.json())
      .subscribe((user: User) => {
        this.user = user;
        this.requestAllUsers();
      }, (err) => {
        console.log(err);
      });
    }

    this.auth.pubsub.loggedIn.observable
    .subscribe((user: User) => {
      this.user = user;
      this.requestAllUsers();
    });
  }

  getUser(): User {
    return this.user;
  }

  isAdmin(): boolean {
    return get(this.user, 'admin', false);
  }

  getUsers(): User[] {
    return this.users;
  }

  private requestAllUsers() {
    return this.authHttp.get(`${this.domain}/api/user/users`)
    .map(res => res.json())
    .map((users: User[]) => {
      this.users = users;
      this.usersSubject.next(this.users);
      return this.users;
    }, (err) => {
      console.log(err);
    })
    .subscribe();
  }
}
