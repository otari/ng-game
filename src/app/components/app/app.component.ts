import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { timer } from 'rxjs/observable/timer';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements AfterViewInit {

    private title = 'Europabet';

    private loaded:boolean = false;
    private progress = 0;

    ngAfterViewInit() {

        //Fake implementation of loading progress
        const source = Observable
            .timer(1000, 1000)
            .map(tick => tick)
            .subscribe(tick => {
                //increase by random number to postiche chunk load
                this.progress = this.progress + Math.floor(Math.random() * 10);

                if (this.progress >= 100) {
                    this.progress = 100;
                    this.loaded = !this.loaded;
                    source.unsubscribe();
                }
            });
    }

    /**
     * ALways use getters for private variables 
     * AOT fails when trying to access private variable in template
     * https://github.com/angular/angular/issues/11978
     * Not sure if still exists in higher versions, have not done AOP build
     */
    public getTitle() {
        return this.title;
    }

    /**
     * Read above description :)
     */
    public getProgress() {
        return this.progress;
    }
}
