import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

import { filter, get, includes } from "lodash";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnDestroy, OnInit {

  projects = [];
  dialogRef: MdDialogRef<ProjectDialogComponent>
  private subs: { [x: string]: Subscription } = {};

  constructor(
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    public user: UserService,
    public projectService: ProjectService
  ) {}

  ngOnInit() {
    this.subs.projectAdded = this.projectService.projectAddedObservable
    .subscribe((project) => {
      this.projects.push(project);
    }, error => console.log(error));

    this.projectService.getProjects()
    .subscribe((projects) => {
      this.projects = projects;
    }, error => console.log(error));
  }

  ngOnDestroy() {
    this.subs.projectAdded.unsubscribe();
  }

  create(project: { name: string }) {
    this.projectService.createProject(project)
    .subscribe(
       content => console.log(content),
       error => console.log(error)
    );
  }

  openCreateDialog() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(ProjectDialogComponent, config);
    this.dialogRef.componentInstance.project = { name: '' };

    this.dialogRef.afterClosed()
      .subscribe(project => {
        if(project) this.create(project);
      });
  }

  getProjects(): any[] {
    if(this.user.isAdmin()) {
      return this.projects;
    } else {
      // console.log(this.user.getUser());
      let ids = get(this.user.getUser(), 'projects', []);
      return filter(this.projects, (project: any) => {
        return includes(ids, project.$loki);
      });
    }
  }


}
