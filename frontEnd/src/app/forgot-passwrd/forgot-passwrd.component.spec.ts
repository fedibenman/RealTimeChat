import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswrdComponent } from './forgot-passwrd.component';

describe('ForgotPasswrdComponent', () => {
  let component: ForgotPasswrdComponent;
  let fixture: ComponentFixture<ForgotPasswrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswrdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
