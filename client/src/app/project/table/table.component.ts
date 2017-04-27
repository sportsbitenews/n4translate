import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { ProjectService } from '../project.service';
import { UserAgentService } from '../../shared/services/user-agent.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

import { PropertyDialog } from './property-dialog.component';

interface Credentials {
  username: string,
  password: string
}

@Component({
  selector: 'i18n-project-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: []
})

export class ProjectTableComponent implements OnDestroy, OnInit {
  @Input() properties;

  list = [];
  currentPage: number = 1;
  loading = true;
  dialogRef;

  propertyRemovedSubscription: Subscription;
  propertyAddedSubscription: Subscription;

  loadTranslationSubscription: Subscription;
  translationsLoadedSubscription: Subscription;

  constructor(
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    public projectService: ProjectService,
    public userAgentService: UserAgentService
  ) {

  }

  ngOnInit() {
    this.propertyRemovedSubscription = this.projectService.propertyRemovedObservable
    .subscribe(() => {
      console.log('ProjectTableComponent removed!');
      this.updateList();
    });

    this.propertyAddedSubscription = this.projectService.propertyAddedObservable
    .subscribe(() => {
      console.log('ProjectTableComponent added!');
      this.updateList();
    });

    this.loadTranslationSubscription = this.projectService.loadTranslationObservable
    .subscribe((properties) => {
      this.loading = true;
    });

    this.translationsLoadedSubscription = this.projectService.translationLoadedObservable
    .subscribe((properties) => {
      this.properties = properties;
      this.updateList();
      this.loading = false;
    });

    setTimeout(() => {
      this.updateList();
    }, 200);
  }

  updateList() {
    let candidates = this.projectService.getPropertiesAsList(this.properties);
    // console.log(candidates);
    this.list = _.map(this.getRefProperties(), (property) => {
      return _.find(candidates, { key: property.key });
    });
  }

  save(entity) {
    this.projectService.add(entity, this.properties);
  }

  getRefProperties(): any[] {
    return this.projectService.selectedProjectProperties;
  }

  onLogin(credentials: Credentials) {
    console.log(credentials);
  }

  style() {
		let style = {};

		if(this.userAgentService.isChrome()) {
      style['margin-right'] = '15px';
		}

		if(this.userAgentService.isFirefox()) {
			style['margin-right'] = '14px';
		}

		return style;
	}

  openDialog(property) {
    this.prepareDialogRef(property);
    this.dialogRef.componentInstance.state = 'edit';
  }

  openCreateDialog() {
    let property = {
      key: '',
      value: ''
    };

    this.prepareDialogRef(property);
    this.dialogRef.componentInstance.state = 'create';
  }

  private prepareDialogRef(property) {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(PropertyDialog, config);

    this.dialogRef.componentInstance.translations = this.properties;
    this.dialogRef.componentInstance.origin = property;
    this.dialogRef.componentInstance.entity = {
      key: property.key,
      value: property.value
    };
  }

  ngOnDestroy() {
    this.propertyRemovedSubscription.unsubscribe();
    this.propertyAddedSubscription.unsubscribe();

    this.loadTranslationSubscription.unsubscribe();
    this.translationsLoadedSubscription.unsubscribe();
  }
}
