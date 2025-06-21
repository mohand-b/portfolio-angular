import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVisitors } from './manage-visitors';

describe('ManageVisitors', () => {
  let component: ManageVisitors;
  let fixture: ComponentFixture<ManageVisitors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVisitors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVisitors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
