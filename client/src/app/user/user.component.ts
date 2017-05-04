import { User } from './user.interface';

import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(public user: UserService) {

  }

  ngOnInit() {

  }

  isAdmin(): boolean {
    return this.user.isAdmin();
  }

  getUser(): User {
    return this.user.getUser();
  }

  getUsers(): User[] {
    return this.user.getUsers();
  }

}
