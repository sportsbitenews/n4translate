import { Component, Inject, Input, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ElementRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserAgentService } from '../../shared/services/user-agent.service';


import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

import { ImportTranslationDialogComponent } from '../import-translation-dialog/import-translation-dialog.component';

@Component({
  selector: 'i18n-project-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ UserAgentService ]
})

export class DetailsComponent implements OnDestroy, OnInit {
  project;
  selectedTranslation;
  lang = 'DE';
  content;

  errorMessage;
  progress;
  progressObserver;

  importTranslationDialogRef: MdDialogRef<ImportTranslationDialogComponent>

  private subs: { [x: string]: Subscription } = {};
  private uploadUrl: string = 'http://localhost:3000/api/translation/import';

  private targetHandlers = {
    chrome: (event) => event.srcElement,
    firefox: (event) => event.target
  };
  private browser: string;

  constructor(
    private dialog: MdDialog,
    private viewContainerRef: ViewContainerRef,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private userAgentService: UserAgentService
  ) {}

  ngOnInit() {
    this.browser = this.userAgentService.getBrowser();

    this.subs.routeParams = this.route.params
    .subscribe(params => {
       this.projectService.findProjectByFilename(params.filename)
       .subscribe((project) => {
         if(!project) {
           this.router.navigate(['/']);
         } else {
           this.project = project;
           let translation = _.get(this.project, 'translations', []);
           this.selectTranslation(_.first(translation));
         }
       }, error => console.log(error));
    });

    this.subs.propertyRemoved = this.projectService.propertyRemovedObservable
    .subscribe(() => {
      console.log('DetailsComponent removed!');
      this.saveContent();
    }, error => console.log(error));

    this.progress = Observable.create(observer => {
      this.progressObserver = observer
    }).share();

    this.progress.subscribe(
      data => {
        console.log(`progress = ${data}`);
      });
  }

  invalidLang(): boolean {
    console.log('invalidLang');
    return _.findIndex(this.project.translations, { lang: this.lang }) > -1;
  }

  ngOnDestroy() {
    this.subs.routeParams.unsubscribe();
    this.subs.propertyRemoved.unsubscribe();
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
    let target = this.getTarget(event);
    if(target) {
      this.makeFileRequest(target.files)
      .subscribe(() => {
        console.log('sent');
      });
    }
  }

  private getTarget(event) {
    let handler = this.targetHandlers[this.browser];
    if(handler) return handler(event);
  }

  private makeFileRequest(files: File[]) {
    return Observable.create((observer) => {
      let formData: FormData = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      formData.append('$loki', this.project.$loki);
      formData.append('lang', this.lang);

      if(files.length > 0) {
        formData.append("i18n", files[0], files[0].name);
      }

      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
             observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        this.progress = Math.round(event.loaded / event.total * 100);
        this.progressObserver.next(this.progress);
      };

      xhr.addEventListener("loadend", (event) => {
        let target = this.getTarget(event);
        let response: string = _.get(target, 'response', '');

        if(response) {
          try {
            let project = JSON.parse(response);
            this.project = project;

            this.projectService.updateProject(this.project);

            let translation = _.get(this.project, 'translations', []);
            this.selectTranslation(_.last(translation));
          } catch(err) {
            console.log(err);
          }
        }
      });

      xhr.open('POST', this.uploadUrl, true);
      // xhr.setRequestHeader('enctype', 'multipart/form-data');
      xhr.send(formData);
    });
  }

}
