import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { UserService } from '../../user/user.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  client: { email: string };

  constructor(
    public dialogRef: MdDialogRef<UserDialogComponent>,
    public userService: UserService
  ) {
    
  }

  ngOnInit() {

  }

  create() {
    this.dialogRef.close(this.client);
  }

}
