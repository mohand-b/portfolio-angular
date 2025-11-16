import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneTimelineItemCreate } from './milestone-timeline-item-create';

describe('MilestoneTimelineItemCreate', () => {
  let component: MilestoneTimelineItemCreate;
  let fixture: ComponentFixture<MilestoneTimelineItemCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneTimelineItemCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilestoneTimelineItemCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
