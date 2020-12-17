/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {coerceNumberProperty} from '@angular/cdk/coercion';
import {ChangeDetectorRef, Directive, ElementRef, Input} from '@angular/core';
import {Thumb} from '@material/slider';
import {MatSlider} from './slider';

/**
 * The native input(s) used by the MatSlider.
 */
@Directive({
  selector: '[mat-slider-thumb]',
  host: {
    'class': 'mdc-slider__input',
    'type': 'range',
    '[min]': 'min',
    '[max]': 'max',
    '[step]': 'step',
    '[value]': 'value',
  }
}) export class MatSliderThumb {
  /** The current value of this slider input. */
  @Input()
  get value(): number { return this._value; };
  set value(v: number) {
    this._value = coerceNumberProperty(v);
    // TODO(wagnermaciel): Relay this change to the MDCSliderFoundation once MatSlider is finished.
  };
  private _value: number;

  /** The minimum value that this slider input can have. */
  @Input()
  get min(): number {
    // TODO(wagnermaciel): Finish implementing "max" getter once MatSlider is finished.
    return 0;
  };
  set min(v: number) { throw Error('Invalid attribute "min" on MatSliderThumb.'); }

  /** The maximum value that this slider input can have. */
  @Input()
  get max(): number {
    // TODO(wagnermaciel): Finish implementing "max" getter once MatSlider is finished.
    return 100;
  };
  set max(v: number) { throw Error('Invalid attribute "max" on MatSliderThumb.'); }

  /** The size of each increment between the values of the slider. */
  @Input()
  get step(): number {
    // TODO(wagnermaciel): Finish implementing "step" getter once MatSlider is finished.
    return 1;
  }
  set step(v: number) { throw Error('Invalid attribute "step" on MatSliderThumb.'); }

  /** Indicates which slider thumb this input corresponds to. */
  get thumb(): Thumb { return this._thumb; }
  set thumb(v: Thumb) {
    this._thumb = v;
    this._cdr.detectChanges();
  }
  private _thumb: Thumb;

  /** MDC Slider does not use the disabled attribute it's native inputs. */
  @Input()
  set disabled(v: boolean) { throw Error('Invalid attribute "disabled" on MatSliderThumb.'); }

  constructor(private _el: ElementRef, private _slider: MatSlider, private _cdr: ChangeDetectorRef) {}

  getRootEl(): HTMLInputElement { return this._el.nativeElement; };
}
