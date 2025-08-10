import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherTimelineItemCreate } from './other-timeline-item-create';

describe('OtherTimelineItemCreate', () => {
  let component: OtherTimelineItemCreate;
  let fixture: ComponentFixture<OtherTimelineItemCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherTimelineItemCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherTimelineItemCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
