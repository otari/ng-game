import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as createjs from 'createjs-module';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})

export class LoaderComponent implements AfterViewInit {

    /**
     * @param number current progress
     */
    @Input() progress: number = 0;

    /**
     * @param canvas element reference in template
     */
    @ViewChild('loader') loader: ElementRef;

    /**
     * @param text 
     */
    private text: any;

    /**
     * @description Canvas stage
     * @param any
     */
    private stage: any;

    /**
     * @param number canvas width
     */
    private width: number = 600;

    /**
     * @param number canvas height
     */
    private height: number = 25;


    /**
     * 
     */
    private fill: any;

    /**
     * 
     */
    ngAfterViewInit() {

        this.stage = new createjs.Stage(this.loader.nativeElement);

        createjs.Ticker.addEventListener("tick", this.stage);
        createjs.Ticker.setFPS(60);

        const bar = new createjs.Shape().set({ x: 2, y: 2 });

        bar.graphics.beginFill("rgba(0,0,0,.5)").drawRect(0, 0, 600, 30);
        this.stage.addChild(bar);

        this.fill = new createjs.Shape().set({ x: 2, y: 2, scaleX: 0 });
        this.fill.graphics.beginFill("#f05a22").drawRect(0, 0, 600, 30);

        this.stage.addChild(this.fill);

        this.text = new createjs.Text(`${this.progress.toString()} %`, 'Arial', 'white');
        this.text.scaleX = 2;
        this.text.scaleY = 2;
        // this.text.alpha = 0.2;
        this.stage.addChild(this.text);

        // .to({ alpha: 1 }, 1500)
        // .to({ text: "Ciao!" }, 800)
        // .to({ rotation: 360, text: "Hello" }, 1300)
        // .to({ y: 380 }, 2000, createjs.Ease.bounceOut)
        // .wait(1000)
        // .call(alert, ["Done animating!"], window)
        ;

        this.stage.update();
    }

    ngOnChanges() {
        this.progress = this.progress >= 100 ? 100 : this.progress;
        //we need to check existance of fill variable
        //as ngOnChanges runs before ngAfterViewInit
        if (this.fill) {
            createjs.Tween.get(this.fill).to({ scaleX: this.progress / 100 }, 1000, createjs.Ease.quadIn);
            this.text.text = `${this.progress} %`;
            createjs.Tween.get(this.text).to({ x: this.progress === 100 ? 540 : this.progress * 6 }, 1000, createjs.Ease.linear)

        }
    }

    public getProgress() {
        return this.progress;
    }
}
