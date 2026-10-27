import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupModalComponent } from './popup-modal.component';

describe('PopupModalComponent', () => {
  let component: PopupModalComponent;
  let fixture: ComponentFixture<PopupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default inputs', () => {
    expect(component.message).toBe('');
    expect(component.title).toBe('');
    expect(component.closeShow).toBe('0');
  });

  it('should emit close event', () => {
    spyOn(component.closeEvt, 'emit');
    component.ok();
    expect(component.closeEvt.emit).toHaveBeenCalledWith(true);
    component.cancel();
    expect(component.closeEvt.emit).toHaveBeenCalledWith(false);
  });
});
