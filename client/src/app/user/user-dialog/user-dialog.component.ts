import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { UserService } from '../../user/user.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { includes } from 'lodash';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  client: { email: string };
  checkUserExist = false;

  constructor(
    public dialogRef: MdDialogRef<UserDialogComponent>,
    public userService: UserService
  ) {
    
  }

  ngOnInit() {
    this.checkUserExist = false;
  }

  checkExistingUsers() {
    this.checkUserExist = false;

    let userEmails = this.userService
      .getUsers()
      .map(user => user.email);

    this.checkUserExist = includes(userEmails, this.client.email);
  }

  create() {
    if(this.checkUserExist == false) {
      this.dialogRef.close(this.client);
    }
  }

  clearCheckUser() {
    this.checkUserExist = false;
  }

}
