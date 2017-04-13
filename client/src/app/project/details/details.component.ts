import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserAgentService } from '../../shared/services/user-agent.service';


import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

@Component({
  selector: 'i18n-project-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ UserAgentService ]
})

export class DetailsComponent implements OnDestroy, OnInit {
  project;
  selectedTranslation;

  errorMessage;
  progress;
  progressObserver;

  private subs: { [x: string]: Subscription } = {};
  private uploadUrl: string = 'http://localhost:3000/api/translation/import';

  private targetHandlers = {
    chrome: (event) => event.srcElement,
    firefox: (event) => event.target
  };
  private browser: string;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private userAgentService: UserAgentService
  ) {}

  ngOnInit() {
    this.browser = this.userAgentService.getBrowser();

    this.subs.routeParams = this.route.params
    .subscribe(params => {
       this.projectService.findProjectByFilename(params.filename)
       .subscribe((project) => {
         this.project = project;
         let translation = _.get(this.project, 'translations', []);
         this.selectTranslation(_.first(translation));
       }, error => console.log(error));
    });

    this.progress = Observable.create(observer => {
      this.progressObserver = observer
    }).share();

    this.progress.subscribe(
      data => {
        console.log(`progress = ${data}`);
      });
  }

  ngOnDestroy() {
    this.subs.routeParams.unsubscribe();
  }

  selectTranslation(translation) {
    this.selectedTranslation = translation;
  }

  isSelectTranslation(translation): boolean {
    return this.selectedTranslation === translation;
  }

  onChange(event) {
    console.log('onChange', event);
    // var files = event.srcElement.files;
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

  private makeFileRequest (files: File[]) {
    return Observable.create((observer) => {
      let formData: FormData = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      formData.append('$loki', this.project.$loki);

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
