import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../project/project.service';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnDestroy, OnInit {

  errorMessage;
  entity = {};
  projects = [];
  private subs: { [x: string]: Subscription } = {};

  constructor(private projectService: ProjectService) {}

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

  create() {
    this.projectService.createProject(this.entity)
    .subscribe(
       content => console.log(content),
       error => console.log(error)
    );
  }

}
