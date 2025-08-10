import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimelineItemCreate } from './project-timeline-item-create';

describe('ProjectTimelineItemCreate', () => {
  let component: ProjectTimelineItemCreate;
  let fixture: ComponentFixture<ProjectTimelineItemCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTimelineItemCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTimelineItemCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
