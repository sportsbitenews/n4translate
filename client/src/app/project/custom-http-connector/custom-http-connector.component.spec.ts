import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHttpConnectorComponent } from './custom-http-connector.component';

describe('CustomHttpConnectorComponent', () => {
  let component: CustomHttpConnectorComponent;
  let fixture: ComponentFixture<CustomHttpConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomHttpConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHttpConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
