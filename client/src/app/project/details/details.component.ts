import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ElementRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UploadFileService } from '../../shared/services/upload-file.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

import { ImportTranslationDialogComponent } from '../import-translation-dialog/import-translation-dialog.component';

@Component({
  selector: 'i18n-project-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ UploadFileService ]
})

export class DetailsComponent implements OnDestroy, OnInit {
  project;
  selectedTranslation;
  lang = 'DE';
  content;
  errorMessage;

  importTranslationDialogRef: MdDialogRef<ImportTranslationDialogComponent>

  private subs: { [x: string]: Subscription } = {};
  private uploadUrl: string = 'http://localhost:3000/api/translation/import';

  constructor(
    private dialog: MdDialog,
    private viewContainerRef: ViewContainerRef,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadFileService: UploadFileService
  ) {}

  ngOnInit() {
    this.subs.routeParams = this.route.params
    .subscribe(params => {
       this.projectService.emptySelectedProjectProperties();
       this.projectService.findProjectByFilename(params.filename)
       .subscribe((project) => {
         if(!project) {
           this.router.navigate(['/']);
         } else {
           this.project = project;
           let translation = _.get(this.project, 'translations', []);
           this.selectTranslation(_.first(translation));

           this.projectService.requestSelectedProjectProperties(this.project)
           .subscribe((properties) => {
            //  console.log(properties);
           });
         }
       }, error => console.log(error));
    });

    this.subs.propertyRemoved = this.projectService.propertyRemovedObservable
    .subscribe(() => {
      console.log('DetailsComponent removed!');
      this.saveContent();
    }, error => console.log(error));

    // this.progress = Observable.create(observer => {
    //   this.progressObserver = observer
    // }).share();
    //
    // this.progress.subscribe(
    //   data => {
    //     console.log(`progress = ${data}`);
    //   });
  }

  ngOnDestroy() {
    this.subs.routeParams.unsubscribe();
    this.subs.propertyRemoved.unsubscribe();
  }

  invalidLang(): boolean {
    if(_.isString(this.lang) === false) return true;
    if(_.trim(this.lang) === '') return true;

    return _.findIndex(this.project.translations, { lang: this.lang }) > -1;
  }

  getLangs(): any[] {
    return _.map(this.project.translations, 'lang');
  }

  updateRefLang(event) {
    console.log(event);
    let reflang = _.get(event, 'value');
    if(_.isString(reflang)) {
      this.projectService.setReflangOfProject(this.project, reflang)
      .subscribe(
         (res) => {
           console.log(res);
           console.log('reflang saved!');

           this.projectService.requestSelectedProjectProperties(this.project)
             .subscribe((properties) => {
              //  console.log(properties);
             });
         },
         error => this.errorMessage = <any>error
      );
    }
  }

  appendTranslationToProject() {
    this.projectService.appendTranslationToProject(this.project, this.lang, this.content)
    .subscribe(
       (project) => {
         console.log(project);
         this.lang = '';
         this.project = project;
         this.projectService.updateProject(this.project);

         let translation = _.get(this.project, 'translations', []);
         this.selectTranslation(_.last(translation));

         console.log(`new Lang: ${ this.lang } appended!`);
       },
       error => this.errorMessage = <any>error
    );
  }

  selectTranslation(translation) {
    this.selectedTranslation = translation;
    if(this.selectedTranslation) {
      this.getContent();
    }
  }

  isSelectTranslation(translation): boolean {
    return this.selectedTranslation === translation;
  }

  getContent() {
    this.projectService.getTranslation(this.selectedTranslation || {})
      .subscribe(
         content => this.content = content,
         error => this.errorMessage = <any>error
      );
  }

  saveContent() {
    console.log(this.selectedTranslation, this.content);
    this.projectService.saveTranslation(this.selectedTranslation, this.content)
    .subscribe(
       (res) => {
         console.log(res);
         console.log('translation saved!');
       },
       error => this.errorMessage = <any>error
    );
  }

  openImportTranslationDialog() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.importTranslationDialogRef = this.dialog.open(ImportTranslationDialogComponent, config);
    this.importTranslationDialogRef.componentInstance.lang = '';

    this.importTranslationDialogRef.afterClosed()
      .subscribe(lang => {
        console.log('lang', lang);
      });
  }

  export(element) {
    if(this.content) {
      let body = encodeURIComponent(JSON.stringify(this.content, null, 2));
      element.setAttribute('href', `data:text/json;charset=utf-8,${body}`);
      element.setAttribute('download', this.selectedTranslation.originalname);
      element.click();
    }
  }

  onChange(event) {
    let data = {
      $loki: this.project.$loki,
      lang: this.lang
    };

    if(_.has(this.project, 'reflang') === false) {
      _.set(data, 'reflang', this.lang);
    }

    this.uploadFileService.send(this.uploadUrl, event, data)
    .subscribe((project) => {
      console.log('file saved!');
      this.project = project;

      this.projectService.updateProject(this.project);

      let translation = _.get(this.project, 'translations', []);
      this.selectTranslation(_.last(translation));

      this.projectService.requestSelectedProjectProperties(this.project)
      .subscribe((properties) => {
        // console.log(properties);
      });
    });
  }

}
