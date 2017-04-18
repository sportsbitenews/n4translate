import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import * as _ from "lodash";

@Component({
  selector: 'i18n-project-translation',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnDestroy, OnInit {
  @Input() content;
  errorMessage;

  private subs: { [x: string]: Subscription } = {};

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.subs.routeParams = this.route.params
    // .subscribe(params => {
    //    this.projectService.findProjectByFilename(params.filename)
    //    .subscribe((project) => {
    //      this.project = project;
    //
    //      let translation = _.get(this.project, 'translations.0');
    //      this.getContent(translation);
    //    }, error => console.log(error));
    // });
  }

  ngOnDestroy() {
    // this.subs.routeParams.unsubscribe();
  }

  getPaths() {
    return this.projectService.getPaths(this.content);
  }

}
