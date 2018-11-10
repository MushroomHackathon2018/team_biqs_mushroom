import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionFloorComponent } from './section-floor.component';

describe('SectionFloorComponent', () => {
  let component: SectionFloorComponent;
  let fixture: ComponentFixture<SectionFloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionFloorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
