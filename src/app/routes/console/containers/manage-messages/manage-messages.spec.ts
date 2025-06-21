import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMessages } from './manage-messages';

describe('ManageMessages', () => {
  let component: ManageMessages;
  let fixture: ComponentFixture<ManageMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
