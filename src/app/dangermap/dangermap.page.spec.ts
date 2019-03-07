import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangermapPage } from './dangermap.page';

describe('DangermapPage', () => {
  let component: DangermapPage;
  let fixture: ComponentFixture<DangermapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangermapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangermapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
