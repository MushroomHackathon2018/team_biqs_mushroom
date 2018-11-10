import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSceneComponent } from './section-scene.component';

describe('SectionSceneComponent', () => {
  let component: SectionSceneComponent;
  let fixture: ComponentFixture<SectionSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
