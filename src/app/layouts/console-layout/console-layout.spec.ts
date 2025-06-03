import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleLayout } from './console-layout';

describe('ConsoleLayout', () => {
  let component: ConsoleLayout;
  let fixture: ComponentFixture<ConsoleLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
