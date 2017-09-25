import { Component, Inject, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'project-custom-http-connector',
  templateUrl: './custom-http-connector.component.html',
  styleUrls: ['./custom-http-connector.component.css']
})
export class CustomHttpConnectorComponent implements OnInit {
  project: any;

  options = {
    basePathname: "",
    translations: [{
      getTranslations: {
        method: "GET",
        pathname: ""
      },
      saveTranslation: {
        method: "POST",
        pathname: "",
        data: {}
      },
    }]
  };

  optionsText: string;

  constructor(
    public dialogRef: MdDialogRef<CustomHttpConnectorComponent>,
    public projectService: ProjectService
  ) { }

  ngOnInit() {
    this.options = this.project.customHttpConnector || this.options;
    this.optionsText = JSON.stringify(this.options, null, 2);
  }

  create() {
    this.options = JSON.parse(this.optionsText);
    this.dialogRef.close(this.options);
  }

}
