import { Injectable, Inject } from '@angular/core';
import * as _ from "lodash";

@Injectable()
export class UserAgentService {

  public browsers = {
    chrome: /chrome/i,
    safari: /safari/i,
    firefox: /firefox/i,
    ie: /internet explorer/i
  };

  public userAgent: string;
  private name: string;

  constructor(@Inject('Window') private window: Window) {
    this.userAgent = this.window.navigator.userAgent
  }

  getBrowser(): string {
    this.name = this.name || this.extractBrowser();
    return this.name;
  }

  extractBrowser(): string {
    let browser: string;
    _.forOwn(this.browsers, (regexp, name) => {
      if(regexp.test(this.userAgent)) {
        browser = name;
        return false;
      }
    });
    return browser;
  }

  isChrome(): boolean {
    return 'chrome' === this.getBrowser();
  }

  isFirefox(): boolean {
    return 'firefox' === this.getBrowser();
  }

}
