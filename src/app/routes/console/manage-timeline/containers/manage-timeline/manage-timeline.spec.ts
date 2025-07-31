import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTimeline } from './manage-timeline';

describe('ManageTimeline', () => {
  let component: ManageTimeline;
  let fixture: ComponentFixture<ManageTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
