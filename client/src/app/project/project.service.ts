import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as _ from "lodash";

@Injectable()
export class ProjectService {

  private host = 'http://localhost:3000';
  private translationUrl = `http://localhost:3000/api/project/content`;

  private propertyRemoved = new Subject<void>();
  public propertyRemovedObservable;

  private propertyAdded = new Subject<void>();
  public propertyAddedObservable;

  private projectAdded = new Subject<any>();
  public projectAddedObservable;

  private projectUpdated = new Subject<any>();
  public projectUpdatedObservable;

  private loadTranslation = new Subject<any>();
  public loadTranslationObservable;

  private translationLoaded = new Subject<any>();
  public translationLoadedObservable;

  private projects;

  constructor (private http: Http) {
    this.propertyRemovedObservable = this.propertyRemoved.asObservable().share();
    this.propertyAddedObservable = this.propertyAdded.asObservable().share();
    this.projectAddedObservable = this.projectAdded.asObservable().share();
    this.projectUpdatedObservable = this.projectUpdated.asObservable().share();

    this.loadTranslationObservable = this.loadTranslation.asObservable().share();
    this.translationLoadedObservable = this.translationLoaded.asObservable().share();
  }

  createProject(data): Observable<any> {
    return this.http
      .post(`${this.host}/api/project/create`, data)
      .map(this.extractData)
      .map((project) => {
        this.projectAdded.next(project);
        return project;
      })
      .catch(this.handleError);
  }

  updateProject(project) {
    let index = _.findIndex(this.projects, _.pick(project, ['$loki']));
    if(_.isNumber(index)) {
      this.projects[index] = project;
      this.projectUpdated.next();
    }
  }

  getProjects(): Observable<any> {
    if(this.projects) {
      return Observable.of(this.projects);
    }

    return this.http
      .get(`${this.host}/api/projects`)
      .map(this.extractData)
      .map((projects) => {
        this.projects = projects;
        return projects;
      })
      .catch(this.handleError);
  }

  findProjectByFilename(filename: string): Observable<any> {
    return this.getProjects()
      .map((projects) => _.find(projects, { filename }));
  }

  getTranslation(data): Observable<any> {
    this.loadTranslation.next();

    return this.http
      .post(`${this.host}/api/translation`, data)
      .map(this.extractData)
      .map((translation) => {
        this.translationLoaded.next(translation);
        return translation;
      })
      .catch(this.handleError);
  }

  saveTranslation(translation, content): Observable<any> {
    let body = _.assign({}, translation, { content });
    return this.http
      .post(`${this.host}/api/translation/save`, body)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res.json();
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  getPaths(json, path = '') {
		let paths: string[] = [];
		_.forOwn(json, (value, key) => {
			let valuePath = `${path}.${key}`;
			if(_.isPlainObject(value)) {
				paths = _.concat(paths, this.getPaths(value, valuePath));
			} else {
				paths.push(valuePath);
			}
		});
		return _.map(paths, path => _.trimStart(path, '.'));
  }

  getKeysAsJSON(json) {
    return _.map(json, (value, key) => {
      if(_.isPlainObject(value)) {
        let node = {};
        node[key] = this.getPaths(value);
        return node;
      } else {
        return key;
      }
    });
  }

  getPropertiesAsList(json) {
    return _
      .chain(this.getPaths(json))
      .map((path) => {
        return {
          key: path,
          value: _.get(json, path)
        }
      })
      .filter(entity => entity.value)
      .value();
  }

  remove(path, json) {
    if(_.has(json, path)) {
      _.set(json, path, undefined);
      this.propertyRemoved.next();
    }
  }

  add(entity, json) {
    _.set(json, entity.key, entity.value);
    this.propertyAdded.next();
  }

}
