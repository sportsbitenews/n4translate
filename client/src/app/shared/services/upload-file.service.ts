import { Injectable } from '@angular/core';
import { UserAgentService } from './user-agent.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

@Injectable()
export class UploadFileService {

  private targetHandlers = {
    chrome: (event) => event.srcElement,
    firefox: (event) => event.target
  };
  private browser: string;

  public progress;
  public progressObserver;

  constructor(private userAgentService: UserAgentService) {
    this.browser = this.userAgentService.getBrowser();

    this.progress = Observable.create((observer) => {
      this.progressObserver = observer
    }).share();

    this.progress.subscribe((data) => {
        console.log(`progress = ${data}`);
    });
  }

  send(url, event, data) {
    let target = this.getTarget(event);
    if(target) {
      return this.makeFileRequest(url, target.files, data);
    } else {
      return Observable.of({});
    }
  }

  private getTarget(event): any {
    let handler = this.targetHandlers[this.browser];
    if(handler) return handler(event);
  }

  private makeFileRequest(url, files: File[], data) {
    return Observable.create((observer) => {
      let formData: FormData = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      _.forOwn(data, (value, param) => {
        formData.append(param, value);
      });

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

      xhr.open('POST', url, true);
      // xhr.setRequestHeader('enctype', 'multipart/form-data');
      xhr.send(formData);
    });
  }

}
