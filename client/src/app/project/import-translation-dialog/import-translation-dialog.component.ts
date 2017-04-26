import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

@Component({
  selector: 'app-import-translation-dialog',
  templateUrl: './import-translation-dialog.component.html',
  styleUrls: ['./import-translation-dialog.component.css']
})
export class ImportTranslationDialogComponent implements OnInit {

  lang: string;
  
  constructor(
    public dialogRef: MdDialogRef<ImportTranslationDialogComponent>,
    public projectService: ProjectService
  ) { }

  ngOnInit() {

  }

  create() {
    this.dialogRef.close(this.lang);
  }

}
