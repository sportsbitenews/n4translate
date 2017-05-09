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

import { get, pick } from "lodash";
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  private user: User;
  private users: User[];

  public usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable().share();

  constructor(private auth: AuthService, private authHttp: AuthHttp) {
    this.init();
  }

  init() {
    if(this.auth.loggedIn()) {
      this.authHttp.get(`${environment.apiUrl}/api/user/instance`)
      .map(res => res.json())
      .subscribe((user: User) => {
        console.log('user/instance', this.user);
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

  create(client: { email: string; }) {
    if(this.auth.loggedIn()) {
      this.authHttp.post(`${environment.apiUrl}/api/user/create`, client)
      .map(res => res.json())
      .subscribe((user: User) => {
        // console.log('new client', user);
        this.users.push(user);
        this.usersSubject.next(this.users);
      }, (err) => {
        console.log(err);
      });
    }
  }

  setAdmin(user: User): Observable<User> {
    let data = pick(user, ['$loki', 'admin']);
    return this.authHttp.post(`${environment.apiUrl}/api/user/admin`, data)
    .map(res => res.json())
    .map((user: User) => {
      console.log(user);
      return user;
    }, (err) => {
      console.log(err);
    });
  }

  private requestAllUsers() {
    return this.authHttp.get(`${environment.apiUrl}/api/user/users`)
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

  addProjects(client: User): Observable<any> {
    let url: string = `${environment.apiUrl}/api/user/projects`;
    let body = pick(client, ['$loki', 'projects']);

    return this.authHttp.post(url, body)
    .map(res => res.json())
    .map((res: any) => {
      console.log(res);
      return res;
    }, (err) => {
      console.log(err);
    });
  }

  assignPasswordToClient(client: any) {
    let url: string = `${environment.apiUrl}/api/user/assign/password`;
    return this.authHttp.post(url, client)
    .map(res => res.json())
    .map((res: any) => {
      client.newPassword = undefined;
      return res;
    }, (err) => {
      console.log(err);
    });
  }

}
