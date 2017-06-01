import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { CanActivate, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';

import { NgxPaginationModule } from 'ngx-pagination';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KeysPipe } from './shared/pipes/keys';

import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';
import { ProjectSectionComponent } from './project/section/section.component';
import { ProjectTableComponent } from './project/table/table.component';
import { PropertyDialog } from './project/table/property-dialog.component';
import { SectionSelectorComponent } from './project/section-selector/section-selector.component';
import { UserComponent } from './user/user.component';
import { ProjectsComponent } from './projects/projects.component';
import { DetailsComponent } from './project/details/details.component';
import { ProjectDialogComponent } from './projects/project-dialog/project-dialog.component';
import { ImportTranslationDialogComponent } from './project/import-translation-dialog/import-translation-dialog.component';
import { DeleteTranslationConfirmDialogComponent } from './project/delete-translation-confirm-dialog/delete-translation-confirm-dialog.component';
import { UserDialogComponent } from './user/user-dialog/user-dialog.component';

import { UploadFileService } from './shared/services/upload-file.service';
import { UserAgentService } from './shared/services/user-agent.service';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

import { ProjectService } from './project/project.service';
import { UserProjectsComponent } from './user/user-projects/user-projects.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

export const authHttp = {
  provide: AuthHttp,
  useFactory: authHttpServiceFactory,
  deps: [Http, RequestOptions]
};

const appRoutes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project/:filename',
    component: ProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project/details/:filename',
    component: DetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    ProjectComponent,
    ProjectSectionComponent,
    ProjectTableComponent,
    PropertyDialog,
    SectionSelectorComponent,
    UserComponent,
    ProjectsComponent,
    DetailsComponent,
    ProjectDialogComponent,
    ImportTranslationDialogComponent,
    DeleteTranslationConfirmDialogComponent,
    AuthComponent,
    UserDialogComponent,
    UserProjectsComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    ImportTranslationDialogComponent,
    PropertyDialog,
    ProjectDialogComponent,
    UserDialogComponent,
    DeleteTranslationConfirmDialogComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    authHttp,
    ProjectService,
    UploadFileService,
    UserAgentService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
