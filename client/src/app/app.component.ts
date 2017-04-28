import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project/project.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  constructor(private auth: AuthService) {

  }

  ngOnInit() {

  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

  logout() {
    return this.auth.logout();
  }

}
