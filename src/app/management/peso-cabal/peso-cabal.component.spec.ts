import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesoCabalComponent } from './peso-cabal.component';

describe('PesoCabalComponent', () => {
  let component: PesoCabalComponent;
  let fixture: ComponentFixture<PesoCabalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PesoCabalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesoCabalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
