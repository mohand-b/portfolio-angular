import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestoneForm } from './milestone-form';

describe('MilestoneForm', () => {
  let component: MilestoneForm;
  let fixture: ComponentFixture<MilestoneForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilestoneForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
