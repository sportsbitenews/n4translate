import { User } from './user.interface';

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { UserService } from './user.service';

import { Observable } from 'rxjs/Observable';

import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public viewer: User;
  private dialogRef: MdDialogRef<UserDialogComponent>;

  constructor(
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    public user: UserService
  ) {

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

  setAdmin(client: User) {
    this.user.setAdmin(client)
      .subscribe((savedClient: User) => {
        client.admin = savedClient.admin;
      }, (err) => {
        console.log(err);
      });
  }

  assignPasswordToClient(client: any) {
    this.user.assignPasswordToClient(client)
      .subscribe((res: any) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
  }

  openCreateDialog() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(UserDialogComponent, config);
    this.dialogRef.componentInstance.client = { email: '' };

    this.dialogRef.afterClosed()
      .subscribe(client => {
        if(client) this.user.create(client);
      });
  }

}
