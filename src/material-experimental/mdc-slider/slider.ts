/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {coerceBooleanProperty, coerceNumberProperty} from '@angular/cdk/coercion';
import {Platform} from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {SpecificEventListener, EventType} from '@material/base';
import {MDCSliderAdapter, MDCSliderFoundation, Thumb, TickMark} from '@material/slider';
import {MatSliderThumb} from './slider-thumb';
import {MatSliderThumbDecorator} from './slider-thumb-decorator';

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

  // ************************* //
  // View and content children //
  // ************************* //

  /** The visual slider thumb(s). */
  @ViewChildren(MatSliderThumbDecorator) _thumbs: QueryList<MatSliderThumbDecorator>;
  private get thumbs(): MatSliderThumbDecorator[] { return this._thumbs?.toArray(); }

  /** The active section of the slider track. */
  @ViewChild('trackActive') _trackActive: ElementRef<HTMLElement>;
  private get trackActive(): HTMLElement { return this._trackActive.nativeElement; }

  /** The hidden range inputs. */
  @ContentChildren(MatSliderThumb) _inputs: QueryList<MatSliderThumb>;
  private get inputs(): MatSliderThumb[] { return this._inputs ? this._inputs.toArray() : []; }

  // *************** //
  // Input variables //
  // *************** //

  /** Whether the slider is disabled. */
  @Input()
  get isDisabled(): boolean { return this._isDisabled; }
  set isDisabled(v: boolean) {
    this._isDisabled = coerceBooleanProperty(v);
    if (this.initialized) {
      this._foundation.setDisabled(v);
    }
  }
  private _isDisabled = false;

  /** Whether the slider displays a numeric value label upon pressing the thumb. */
  @Input()
  get isDiscrete(): boolean { return this._isDiscrete; }
  set isDiscrete(v) { this._isDiscrete = coerceBooleanProperty(v); }
  private _isDiscrete = false;

  /** Whether the slider displays tick marks along the slider track. */
  @Input()
  get hasTickMarks(): boolean { return this._hasTickMarks; }
  set hasTickMarks(v: boolean) { this._hasTickMarks = this.isDiscrete && coerceBooleanProperty(v); }
  private _hasTickMarks: boolean = false;

  /** The minimum value that the slider can have. */
  @Input()
  get min(): number { return this._min; }
  set min(v: number) { this._min = coerceNumberProperty(v, this._min); }
  private _min = 0;

  /** The maximum value that the slider can have. */
  @Input()
  get max(): number { return this._max; }
  set max(v: number) { this._max = coerceNumberProperty(v, this._max); }
  private _max = 100;

  /** The values at which the thumb will snap. */
  @Input()
  get step(): number { return this._step; }
  set step(v: number) { this._step = coerceNumberProperty(v, this._step); }
  private _step: number = 1;

  /**
   * Function that will be used to format the value before it is displayed
   * in the thumb label. Can be used to format very large number in order
   * for them to fit into the slider thumb.
   */
  @Input() displayWith: ((value: number) => string) | null;

  // *************** //
  // Class variables //
  // *************** //

  /** Instance of the MDC slider foundation for this slider. */
  private _foundation = new MDCSliderFoundation(new SliderAdapter(this));

  /** Used to keep track of & render the active & inactive tick marks on the slider track. */
  tickMarks: TickMark[] = [];

  /** Whether the foundation has been initialized. */
  initialized: boolean = false;

  /** Whether this is a ranged slider. */
  get isRange(): boolean { return this.inputs.length === 2; }

  /** The text representation of the start inputs value. */
  get startValueIndicatorText() {
    return this._getValueIndicatorText(this.getValue(Thumb.START));
  }

  /** The text representation of the end inputs value. */
  get endValueIndicatorText() {
    return this._getValueIndicatorText(this.getValue(Thumb.END));
  }

  // ************** //
  // Public methods //
  // ************** //

  getValue(thumb: Thumb): number {
    return this._getInput(thumb).value;
  }
  setValue(value: number, thumb: Thumb) {
    if (thumb === Thumb.START) {
      this._foundation.setValueStart(value);
    } else {
      this._foundation.setValue(value);
    }
  }
  getTickMarkClass(tickMark: TickMark) {
    return tickMark === TickMark.ACTIVE
      ? 'mdc-slider__tick-mark--active'
      : 'mdc-slider__tick-mark--inactive';
  }

  // *************** //
  // Private Methods //
  // *************** //

  private _getInput(thumb: Thumb): MatSliderThumb {
    return thumb === Thumb.END ? this.inputs[this.inputs.length - 1] : this.inputs[0];
  }
  private _getValueIndicatorText(value: number) {
    return this.displayWith ? this.displayWith(value) : value.toString();
  }

  constructor(private _platform: Platform) {}

  ngAfterViewInit() {
    this.initialized = true;
    this._initInputs();
    this._foundation.init();
    if (this._platform.isBrowser) {
      this._foundation.layout();
    }
  }

  ngOnDestroy() {
    if (this._platform.isBrowser) {
      this._foundation.destroy();
    }
  }

  private _initInputs() {
    if (this.isRange) {
      this.inputs[0].thumb = Thumb.START;
      this.inputs[1].thumb = Thumb.END;
    } else {
      this.inputs[0].thumb = Thumb.END;
    }
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
