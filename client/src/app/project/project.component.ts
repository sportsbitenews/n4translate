import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'i18n-project-translation',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {
  @Input() content;
  errorMessage;

  private subs: { [x: string]: Subscription } = {};

  constructor(
    public user: UserService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

  }

  getPaths() {
    return this.projectService.getPaths(this.content);
  }

}
