import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillItem } from './skill-item';

describe('SkillItem', () => {
  let component: SkillItem;
  let fixture: ComponentFixture<SkillItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
