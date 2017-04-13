import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ ProjectService ]
})

export class AppComponent implements OnInit {

  constructor(private projectService: ProjectService) {

  }

  ngOnInit() {

  }

}
