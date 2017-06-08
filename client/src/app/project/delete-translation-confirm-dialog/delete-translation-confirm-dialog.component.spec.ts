import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTranslationConfirmDialogComponent } from './delete-translation-confirm-dialog.component';

describe('DeleteTranslationConfirmDialogComponent', () => {
  let component: DeleteTranslationConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteTranslationConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTranslationConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTranslationConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
