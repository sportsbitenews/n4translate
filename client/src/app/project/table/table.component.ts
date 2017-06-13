import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef, MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { ProjectService } from '../project.service';
import { UserAgentService } from '../../shared/services/user-agent.service';

import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { chain, cloneDeep, filter, find, includes, map, toUpper } from "lodash";

import { PropertyDialog } from './property-dialog.component';

interface Credentials {
  username: string,
  password: string
}

@Component({
  selector: 'i18n-project-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [],
  encapsulation: ViewEncapsulation.None //hinzugefügt wegen Bug mit extraClasses von Snackbar
})

export class ProjectTableComponent implements OnDestroy, OnInit {
  @Input() properties;
  @Input() translation;

  list = [];
  currentPage: number = 1;
  loading = true;
  dialogRef;
  needle: string;
  status: string;
  toggleFilter = false;
  variablesFromTranslation = [];
  beforeEdit = [];

  propertyRemovedSubscription: Subscription;
  propertyAddedSubscription: Subscription;

  loadTranslationSubscription: Subscription;
  translationsLoadedSubscription: Subscription;
  selectedProjectPropertiesSubscription: Subscription;

  constructor(
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    public projectService: ProjectService,
    public userAgentService: UserAgentService,
    public snackBar: MdSnackBar
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
      // console.log('this.properties', this.properties);
      // console.log('this.projectService.selectedProjectProperties', this.projectService.selectedProjectProperties);
      this.properties = properties;
      this.updateList();
      this.loading = false;
    });

    this.selectedProjectPropertiesSubscription = this.projectService.selectedProjectPropertiesObservable
    .subscribe(() => {
      this.updateList();
    });
  }

  updateList() {
    let candidates = this.projectService.getPropertiesAsList(this.properties);

    this.list = map(cloneDeep(this.projectService.selectedProjectProperties), (property: any) => {
      let target = find(candidates, { key: property.key });
      property.status = 'saved';

      if(target) {
        property.target = target;
      } else {
        property.target = {
          key: property.key,
          value: ''
        }
      }

      return property;
    });
  }

  save(entity) {
    entity.status = 'loading';
    this.projectService.saveTranslationProperty(this.translation, entity)
      .subscribe((res: any) => {
        this.projectService.add(entity, this.properties);
        this.updateList();
        entity.status = 'saved';
        this.status='saved';
        this.openSnackBar('save successful', entity);
      }, (err) => {
        console.log(err);
        this.openSnackBar('save failed', entity);
        entity.status = 'failed';
      });
  }

  loadVariablesFromTranslationInList(entity) {
    let regexp = /{{\s*[\w\.]+\s*}}/g;
    let variable;
    let variablesList = [];
    while (variable = regexp.exec(entity.value)) {
      variablesList.push(variable[0]);
    }
    return variablesList;
  }

  checkVariablesFromTranslationUnchanged(entity, property) {
    if(entity.key === property.key) {
      this.beforeEdit = this.loadVariablesFromTranslationInList(property);
    }
    this.variablesFromTranslation = this.loadVariablesFromTranslationInList(entity);

    if(this.beforeEdit.length !== this.variablesFromTranslation.length) {
      return false;
    }

    for(var i = this.beforeEdit.length; i--;) {
      if(this.beforeEdit[i] !== this.variablesFromTranslation[i]) {
        return false;
      }
    }
    return true;
  }

  openSnackBar(msg, entity) {
    let config = new MdSnackBarConfig();
    config.duration = 2000;
    if(msg == 'save successful') {
      config.extraClasses = ['success'];
    }
    else if (msg == 'save failed') {
      config.extraClasses = ['fail'];
    }
    this.snackBar.open('Translation Key: ' + entity.key, msg, config);
  }

  focused(entity: any) {
    if(this.entityHasChanged(entity)) {
      this.save(entity);
    }
  }

  private entityHasChanged(property: any): boolean {
    return property.origin.value !== property.target.value;
  }

  getFilteredProperties(): any[] {
    let needle = toUpper(this.needle);

    return chain(this.list)
      .filter((property: any) => {
        if(this.toggleFilter && property.status != 'edit') {
          return property.target.value ===  '';
        }
        return true;
      })
      .filter((property: any) => {
        return includes(toUpper(property.key), needle) ||
          includes(toUpper(property.value), needle) ||
          includes(toUpper(property.target.value), needle);
      })
      .value();
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
    this.selectedProjectPropertiesSubscription.unsubscribe();
  }
}
