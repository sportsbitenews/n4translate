import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

@Component({
  selector: 'property-dialog',
  templateUrl: './property-dialog.component.html',
  providers: []
})

export class PropertyDialog {
  translations;
  origin;
  entity;
  state?: string;

  constructor(
    public dialogRef: MdDialogRef<PropertyDialog>,
    public projectService: ProjectService
  ) {

  }

  remove() {
    this.projectService.remove(this.origin.key, this.translations);
  }

  add() {
    this.projectService.add(this.entity, this.translations);
  }

  submit() {
    this.add();
  }

}
