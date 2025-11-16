import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationCreate } from './education-create';

describe('EducationCreate', () => {
  let component: EducationCreate;
  let fixture: ComponentFixture<EducationCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
