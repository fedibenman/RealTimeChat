import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPgeComponent } from './main-pge.component';

describe('MainPgeComponent', () => {
  let component: MainPgeComponent;
  let fixture: ComponentFixture<MainPgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
