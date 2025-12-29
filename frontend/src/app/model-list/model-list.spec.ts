import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelList } from './model-list';

describe('ModelList', () => {
  let component: ModelList;
  let fixture: ComponentFixture<ModelList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
