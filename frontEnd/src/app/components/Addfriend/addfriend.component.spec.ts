
export class ComponentsModule {}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addfriend } from './addfriend.component';

describe('ForgotPasswrdComponent', () => {
  let component: Addfriend;
  let fixture: ComponentFixture<Addfriend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Addfriend ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addfriend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
