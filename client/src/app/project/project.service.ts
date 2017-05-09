import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {
  assign,
  chain,
  cloneDeep,
  concat,
  includes,
  isPlainObject,
  isNumber,
  filter,
  find,
  findIndex,
  forOwn,
  get,
  has,
  map,
  pick,
  set,
  trimStart
} from "lodash";

import { environment } from '../../environments/environment';

@Injectable()
export class ProjectService {

  private translationUrl = `${environment.apiUrl}/api/project/content`;

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
  public selectedProjectProperties;

  constructor (private http: Http, private authHttp: AuthHttp) {
    this.propertyRemovedObservable = this.propertyRemoved.asObservable().share();
    this.propertyAddedObservable = this.propertyAdded.asObservable().share();
    this.projectAddedObservable = this.projectAdded.asObservable().share();
    this.projectUpdatedObservable = this.projectUpdated.asObservable().share();

    this.loadTranslationObservable = this.loadTranslation.asObservable().share();
    this.translationLoadedObservable = this.translationLoaded.asObservable().share();
  }

  createProject(data): Observable<any> {
    return this.authHttp
      .post(`${environment.apiUrl}/api/project/create`, data)
      .map(this.extractData)
      .map((project) => {
        this.projectAdded.next(project);
        return project;
      })
      .catch(this.handleError);
  }

  updateProject(project) {
    let index = findIndex(this.projects, pick(project, ['$loki']));
    if(isNumber(index)) {
      this.projects[index] = project;
      this.projectUpdated.next();
    }
  }

  getProjects(): Observable<any> {
    if(this.projects) {
      return Observable.of(this.projects);
    }

    return this.authHttp
      .get(`${environment.apiUrl}/api/projects`)
      .map(this.extractData)
      .map((projects) => {
        this.projects = projects;
        return projects;
      })
      .catch(this.handleError);
  }

  getProjectsByIds(ids: number[]): Observable<any> {
    return this.getProjects()
      .map((projects) => {
        return filter(projects, ({ $loki }) => {
          return includes(ids, $loki);
        })
      });
  }

  getProjectsByExcludeIds(ids: number[]): Observable<any> {
    return this.getProjects()
      .map((projects) => {
        return filter(projects, ({ $loki }) => {
          return includes(ids, $loki) === false;
        })
      });
  }

  findProjectByFilename(filename: string): Observable<any> {
    return this.getProjects()
      .map((projects) => find(projects, { filename }));
  }

  getRefTranslationMeta(project: any): any {
    let reflang = get(project, 'reflang');
    return find(project.translations, { lang: reflang });
  }

  appendTranslationToProject(project: any, lang: string, content: any): Observable<any> {
    let translation = cloneDeep(this.getRefTranslationMeta(project));
    translation.filename = `${translation.filename}_${lang}`;
    translation.lang = lang;

    return this.authHttp
      .post(`${environment.apiUrl}/api/translation/append`, {
        $loki: get(project, '$loki'),
        translation,
        content
      })
      .map(this.extractData)
      .map((project) => {
        return project;
      })
      .catch(this.handleError);
  }

  setReflangOfProject(project: any, reflang: string): Observable<any> {
    return this.authHttp
      .post(`${environment.apiUrl}/api/project/reflang`, {
        reflang,
        $loki: get(project, '$loki')
      })
      .map(this.extractData)
      .map((project) => {
        return project;
      })
      .catch(this.handleError);
  }

  getTranslation(data): Observable<any> {
    this.loadTranslation.next();

    return this.authHttp
      .post(`${environment.apiUrl}/api/translation`, data)
      .map(this.extractData)
      .map((translation) => {
        this.translationLoaded.next(translation);
        return translation;
      })
      .catch(this.handleError);
  }

  saveTranslation(translation, content): Observable<any> {
    let body = assign({}, translation, { content });
    return this.authHttp
      .post(`${environment.apiUrl}/api/translation/save`, body)
      .catch(this.handleError);
  }

  saveTranslationProperty(translation, property): Observable<any> {
    let body = assign({}, translation, { property });

    return this.authHttp
      .post(`${environment.apiUrl}/api/translation/property/save`, body)
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
		forOwn(json, (value, key) => {
			let valuePath = `${path}.${key}`;
			if(isPlainObject(value)) {
				paths = concat(paths, this.getPaths(value, valuePath));
			} else {
				paths.push(valuePath);
			}
		});
		return map(paths, path => trimStart(path, '.'));
  }

  getKeysAsJSON(json) {
    return map(json, (value, key) => {
      if(isPlainObject(value)) {
        let node = {};
        node[key] = this.getPaths(value);
        return node;
      } else {
        return key;
      }
    });
  }

  getPropertiesAsList(json) {
    return chain(this.getPaths(json))
      .map((path) => {
        return {
          key: path,
          value: get(json, path)
        }
      })
      .filter(entity => entity.value)
      .value();
  }

  remove(path, json) {
    if(has(json, path)) {
      set(json, path, undefined);
      this.propertyRemoved.next();
    }
  }

  add(entity, json) {
    console.log(entity, json);
    set(json, entity.key, entity.value);
    this.propertyAdded.next();
  }

  save(entity, json) {
    entity = assign(entity, json);
    this.propertyAdded.next();
  }

  emptySelectedProjectProperties() {
    this.selectedProjectProperties = undefined;
  }

  setSelectedProjectProperties(properties) {
    this.selectedProjectProperties = properties;
    return this.selectedProjectProperties;
  }

  requestSelectedProjectProperties(project: any) {
    let translation = this.getRefTranslationMeta(project);

    if(translation) {
      return this.authHttp
        .post(`${environment.apiUrl}/api/translation`, translation)
        .map(this.extractData)
        .map(json => this.getPropertiesAsList(json))
        .map(properties => this.setSelectedProjectProperties(properties))
        .catch(this.handleError);
    } else {
      return Observable.of(this.selectedProjectProperties);
    }
  }
}
