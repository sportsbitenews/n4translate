import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'i18n-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnDestroy, OnInit {
  project;
  content;
  errorMessage;

  private subs: { [x: string]: Subscription } = {};

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subs.routeParams = this.route.params
    .subscribe(params => {
       this.projectService.findProjectByFilename(params.filename)
       .subscribe((project) => {
         this.project = project;
       }, error => console.log(error));
    });

    this.getContent();
  }

  ngOnDestroy() {
    this.subs.routeParams.unsubscribe();
  }

  getContent() {
    this.projectService.getTranslation()
      .subscribe(
         content => this.content = content,
         error => this.errorMessage = <any>error
      );
  }

  getPaths() {
    return this.projectService.getPaths(this.content);
  }

}
