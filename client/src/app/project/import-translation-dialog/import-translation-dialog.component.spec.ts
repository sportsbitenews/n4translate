import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTranslationDialogComponent } from './import-translation-dialog.component';

describe('ImportTranslationDialogComponent', () => {
  let component: ImportTranslationDialogComponent;
  let fixture: ComponentFixture<ImportTranslationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTranslationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTranslationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
