import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export default class Helper {
    /**
     * 
     * @param elRef 
     * @param width
     * @param height 
     */
    public setElementSize(elRef: ElementRef, width: number, height: number) {
        elRef.nativeElement.width = width;
        elRef.nativeElement.height = height;
    }

    /**
     * 
     * @param by
     * @param value
     * @todo force value of [by] to be only width or height to have a better error message
     */
    public getRatioSize(by: string, widthOrHeight: number, ratio: any): { width: number, height: number } {
        /**
         * @todo  remove this if statement when todo is resolved
         */
        if (by !== 'height' && by !== 'width') {
            return { width: widthOrHeight, height: widthOrHeight }
        }

        return by === 'width' ?
            { width: window.innerWidth, height: Math.round((window.innerWidth / ratio.x) * ratio.y) }
            :
            { width: Math.round((window.innerHeight / ratio.y) * ratio.x), height: window.innerHeight }
    }

    /**
     * 
     * @param min 
     * @param max 
     */
    public getRandomNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}