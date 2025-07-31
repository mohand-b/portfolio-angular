import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBlog } from './manage-blog';

describe('ManageBlog', () => {
  let component: ManageBlog;
  let fixture: ComponentFixture<ManageBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
