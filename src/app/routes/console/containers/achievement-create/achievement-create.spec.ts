import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementCreate } from './achievement-create';

describe('AchievementCreate', () => {
  let component: AchievementCreate;
  let fixture: ComponentFixture<AchievementCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
