import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../../project/project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { includes } from 'lodash';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent implements OnInit {

  project: { name: string };
  checkProjectExist = false;
  projects = [];

  constructor(
    public dialogRef: MdDialogRef<ProjectDialogComponent>,
    public projectService: ProjectService
  ) {

  }

  ngOnInit() {
    this.checkProjectExist = false;

    this.projectService.getProjects()
    .subscribe((projects) => {
      this.projects = projects;
    }, error => console.log(error));
  }

  checkExistingProjects() {
    this.checkProjectExist = false;

    let projectNames = this.projects.map(project => project.name);

    this.checkProjectExist = includes(projectNames, this.project.name);

    this.create();
  }

  create() {
    if(this.checkProjectExist === false) {
      this.dialogRef.close(this.project);
    }
  }

  clearCheckProject() {
    this.checkProjectExist = false;
  }

}
