import { Component, Inject, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../project.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-delete-translation-confirm-dialog',
  templateUrl: './delete-translation-confirm-dialog.component.html',
  styleUrls: ['./delete-translation-confirm-dialog.component.scss']
})
export class DeleteTranslationConfirmDialogComponent implements OnInit {

  selectedTranslation;
  lang = 'DE';

  constructor(
    public dialogRef: MdDialogRef<DeleteTranslationConfirmDialogComponent>,
    public projectService: ProjectService
  ) { }

  ngOnInit() {

  }

  delete() {
    this.dialogRef.close(this.selectedTranslation);
  }

}
