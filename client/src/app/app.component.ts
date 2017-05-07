import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project/project.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  constructor(private auth: AuthService, private user: UserService) {

  }

  ngOnInit() {
    console.log(environment);
  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

  logout() {
    return this.auth.logout();
  }

  isAdmin(): boolean {
    return this.user.isAdmin();
  }

}
