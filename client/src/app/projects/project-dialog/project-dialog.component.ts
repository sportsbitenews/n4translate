import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../../project/project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent implements OnInit {

  project: { name: string };

  constructor(
    public dialogRef: MdDialogRef<ProjectDialogComponent>,
    public projectService: ProjectService
  ) {

  }

  ngOnInit() {

  }

  create() {
    this.dialogRef.close(this.project);
  }

}
