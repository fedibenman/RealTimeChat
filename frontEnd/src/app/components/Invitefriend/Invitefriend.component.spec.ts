
export class ComponentsModule {}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitefriendComponent } from './Invitefriend.component';

describe('ForgotPasswrdComponent', () => {
  let component: InvitefriendComponent;
  let fixture: ComponentFixture<InvitefriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitefriendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitefriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
