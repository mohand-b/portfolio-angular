import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationCreate } from './certification-create';

describe('CertificationCreate', () => {
  let component: CertificationCreate;
  let fixture: ComponentFixture<CertificationCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
