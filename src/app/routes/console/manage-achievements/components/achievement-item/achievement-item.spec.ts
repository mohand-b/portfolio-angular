import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementItem } from './achievement-item';

describe('AchievementItem', () => {
  let component: AchievementItem;
  let fixture: ComponentFixture<AchievementItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
