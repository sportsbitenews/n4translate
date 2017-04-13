import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

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

const appRoutes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'project/:filename', component: ProjectComponent },
  { path: 'project/details/:filename', component: DetailsComponent },
  { path: 'projects', component: ProjectsComponent }
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
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    PropertyDialog
  ],
  providers: [
    { provide: 'Window',  useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
