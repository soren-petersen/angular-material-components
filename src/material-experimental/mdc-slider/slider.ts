/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {SpecificEventListener, EventType} from '@material/base';
import {MDCSliderAdapter, MDCSliderFoundation, Thumb, TickMark} from '@material/slider';

/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
@Component({
  selector: 'mat-slider',
  templateUrl: 'slider.html',
  styleUrls: ['slider.css'],
  host: {'class': 'mdc-slider'},
  exportAs: 'matSlider',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class MatSlider implements AfterViewInit, OnDestroy {
  /** Instance of the MDC slider foundation for this slider. */
  private _foundation = new MDCSliderFoundation(new SliderAdapter(this));

  ngAfterViewInit() {
    this._foundation.init();
    this._foundation.layout();
  }

  ngOnDestroy() {
    this._foundation.destroy();
  }
}

class SliderAdapter implements MDCSliderAdapter {
  constructor(private readonly _delegate: MatSlider) {}
  hasClass(className: string): boolean { return null as any; }
  addClass(className: string): void {}
  removeClass(className: string): void {}
  getAttribute(attribute: string): string | null { return null as any; }
  addThumbClass(className: string, thumb: Thumb): void {}
  removeThumbClass(className: string, thumb: Thumb): void {}
  getInputValue(thumb: Thumb): string { return null as any; }
  setInputValue(value: string, thumb: Thumb): void {}
  getInputAttribute(attribute: string, thumb: Thumb): string | null { return null as any; }
  setInputAttribute(attribute: string, value: string, thumb: Thumb): void {}
  removeInputAttribute(attribute: string, thumb: Thumb): void {}
  focusInput(thumb: Thumb): void {}
  isInputFocused(thumb: Thumb): boolean { return null as any; }
  getThumbKnobWidth(thumb: Thumb): number { return null as any; }
  getThumbBoundingClientRect(thumb: Thumb): ClientRect { return null as any; }
  getBoundingClientRect(): ClientRect { return null as any; }
  isRTL(): boolean { return null as any; }
  setThumbStyleProperty(propertyName: string, value: string, thumb: Thumb): void {}
  removeThumbStyleProperty(propertyName: string, thumb: Thumb): void {}
  setTrackActiveStyleProperty(propertyName: string, value: string): void {}
  removeTrackActiveStyleProperty(propertyName: string): void {}
  setValueIndicatorText(value: number, thumb: Thumb): void {}
  getValueToAriaValueTextFn(): ((value: number) => string) | null { return null as any; }
  updateTickMarks(tickMarks: TickMark[]): void {}
  setPointerCapture(pointerId: number): void {}
  emitChangeEvent(value: number, thumb: Thumb): void {}
  emitInputEvent(value: number, thumb: Thumb): void {}
  emitDragStartEvent(value: number, thumb: Thumb): void {}
  emitDragEndEvent(value: number, thumb: Thumb): void {}
  registerEventHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void {}
  deregisterEventHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void {}
  registerThumbEventHandler<K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void {}
  deregisterThumbEventHandler<K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void {}
  registerInputEventHandler<K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void {}
  deregisterInputEventHandler<K extends EventType>(thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void {}
  registerBodyEventHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void {}
  deregisterBodyEventHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void {}
  registerWindowEventHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void {}
  deregisterWindowEventHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void {}
}
