import { User } from '../user.interface';
import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { ProjectService } from '../../project/project.service';

import { Observable } from 'rxjs/Observable';

import { remove } from "lodash";

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {
  @Input() client: User;

  public projects: any[];
  public clientProjects: any[];
  public selectedProject: any;

  constructor(
    public userService: UserService,
    public projectService: ProjectService
  ) {}

  ngOnInit() {
    this.client.projects = this.client.projects || [];

    this.projectService.getProjects()
      .subscribe((projects: any[]) => {
        this.projects = projects;
      }, (err) => {
        console.log(err);
      });
  }

  getAvailableProjects(): Observable<any[]> {
    return this.projectService.getProjectsByExcludeIds(this.client.projects);
  }

  getClientProjects(): Observable<any[]> {
    return this.projectService.getProjectsByIds(this.client.projects);
  }

  displayFn(project: any): string {
    return project ? project.name : '';
  }

  addProject(project: any) {
    if(project) {
      this.client.projects.push(project.$loki);
    }
    this.saveProjects();
  }

  removeProject(project: any) {
    if(project) {
      remove(this.client.projects, ($loki) => {
        return $loki === project.$loki;
      });
    }
    this.saveProjects();
  }

  saveProjects() {
    this.userService.addProjects(this.client)
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
  }

}
