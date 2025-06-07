import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleMenu } from './console-menu';

describe('ConsoleMenu', () => {
  let component: ConsoleMenu;
  let fixture: ComponentFixture<ConsoleMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
