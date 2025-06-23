import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCategorySection } from './skill-category-section';

describe('SkillCategorySection', () => {
  let component: SkillCategorySection;
  let fixture: ComponentFixture<SkillCategorySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillCategorySection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillCategorySection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
