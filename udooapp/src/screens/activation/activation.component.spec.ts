
import { TestBed, async } from '@angular/core/testing';

import { ActivationComponent } from './activation.component';

describe('ActivationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivationComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(ActivationComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Settings!'`, async(() => {
    const fixture = TestBed.createComponent(ActivationComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Activation');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(ActivationComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Activation');
  }));
});
