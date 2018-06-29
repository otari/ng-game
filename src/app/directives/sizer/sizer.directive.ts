import { Directive, ElementRef } from '@angular/core';
import Helper from '../../utils/helper';

@Directive({
  selector: '[elementSizer]'
})
export class SizerDirective {

  constructor(element:ElementRef, Helper: Helper) {
    
    const ratio:any = {x:16, y:9};
    
    const ratiodSize = Helper.getRatioSize('height', window.innerHeight, ratio);
    
    Helper.setElementSize(element, ratiodSize.width, ratiodSize.height);
  }
}
