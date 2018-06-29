import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import Helper from '../../utils/helper';
import * as createjs from 'createjs-module';
import * as data from '../../../data/cards.json';
import * as manifest from '../../../data/manifest.json';
import Card from './card';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})

export class GameComponent implements AfterViewInit {

    /**
     * Helper Class with awesome methods :)
     */
    private Helper;

    /**
     * CreateJs Loader
     */
    private loader: any;

    /**
     * 
     */
    private ratiodSize: { width: number, height: number } = { width: 0, height: 0 };

    /**
     * Stage
     */
    private stage: any;

    private spinText:any = null;

    /**
     * Keeps Referenc to Roullete
     */
    private roulette: any;

    private spining:boolean = false;

    /**
     * Collection of cards picked from deck
     */
    private pickedCards: Array<Card> = [];

    /**
     * Canvas element reference in component template
     */
    @ViewChild('canvas') canvas: ElementRef;

    /**
     * Constructor 
     * 
     * @param Helper Helper Class
     */
    constructor(Helper: Helper) {

        /**
         * Inside the process of the preload a method called _isCanceled tries to process with a window.createjs object and because of this, 
         * the whole event process is being always stopped if it does not find
         */
        (<any>window).createjs = createjs;

        /**
         * 
         */
        this.Helper = Helper;

        /**
         * Prepare createjs loader for future use
         */
        this.loader = new createjs.LoadQueue(true);

        /**
         * Set manifest load complete listener
         */
        this.loader.on("complete", this.manifestLoadComplete, this);

        /**
         * Set manifest load error listener
         */
        this.loader.on('error', this.manifestLoadError);

        /**
         * set manifest load progress listener
         */
        this.loader.on('progress', this.manifestLoadProgress);
    }

    /**
     * Once view is loaded start loading manifest data
     */
    ngAfterViewInit() {
        this.loader.loadManifest(manifest['data']);
    }

    /**
     * Window Resize Listener
     * Updates canvas size based on window.innerHeight/Width
     * Keeps 16x9 aspect ratio for stage
     * @param event 
     */
    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.ratiodSize = this.Helper.getRatioSize('height', window.innerHeight, { x: 16, y: 9 });
        this.Helper.setElementSize(this.canvas, this.ratiodSize.width, this.ratiodSize.height);
    }

    /**
     * Manifest load coplete listener
     * @param event 
     */
    private manifestLoadComplete(event) {

        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);

        this.createStage();
    }

    /**
     * Manifest load progress listener
     * @param event
     */
    private manifestLoadProgress(event) {
        // 
    }

    /**
     * Manifest error listener
     * @param event 
     */
    private manifestLoadError(event) {
        //
    }

    /**
     * Creates Stage
     */
    private createStage() {
        /**
         * create stage
         */
        this.stage = new createjs.Stage(this.canvas.nativeElement);

        /**
         * Enable mouseover on stage
         */
        this.stage.enableMouseOver(20);

        /**
         * setup ticker for stage update
         */
        createjs.Ticker.on("tick", (event) => {
            this.stage.update(event);
        });

        this.createRoullete();
        this.createDeck();
    }

    /**
     * Create Card Deck
     */
    private createDeck() {
        let x = 150;
        let y = 150;
        
        for (let index = 0; index < 52; index++) {
            let card = new Card(this.Helper, this.loader);
            card.x = x;
            card.y = y;
            card.cursor = "pointer";
            card.regX = card.getBounds().width / 2;
            card.regY = card.getBounds().height / 2;
            this.stage.addChild(card);
            x += .2; y += .2;

            /**
             * Subscribe to card pick event from deck
             */
            card.onCardPick().subscribe( data => {
                
                if(this.pickedCards.length == 5) {
                    alert('Vsio :)');
                    return;
                }

                createjs.Tween.get(card).to({
                    x: (this.pickedCards.length + 1) * 150, y:680
                },200).call(() => {
                    this.pickedCards.push(data);           
                })
            });

            /**
             * Subscribe to card flip event
             */
            card.onCardFlip().subscribe( data => {
                createjs.Tween.get(card).to({
                    scaleX: 0.01
                }, 200).call(() => {
                    const ranges:Array<{min:any,max:any}> = [{min:'002', max:'014'}, {min:202, max:214}, {min:302, max:314}];
                    const randomIndex = Math.floor(Math.random() * ranges.length);
                    card.setId(this.Helper.getRandomNumber(ranges[randomIndex].min, ranges[randomIndex].max));                    
                    //This is just a fake nominal creation for card...
                    card.setNominal(this.Helper.getRandomNumber(2, 14));
                }).to({
                    scaleX: 1
                }, 200).call(() => {
                    this.runRoullete(data.getNominal());
                });
            });

            /**
             * On hover
             */
            card.onCardHover().subscribe( data => {
                if(data.isPicked() && !data.isFlipped()) {
                    createjs.Tween.get(card).to({
                        y: card.y - 10,
                    }, 100).to({
                        y: card.y,
                    }, 100)
                }
            })
        }
    }

    /**
     * Creates Roulette on a stage
     */
    private createRoullete() {

        this.roulette = new createjs.Bitmap(this.loader.getResult("roulette"));

        this.roulette.regX = this.roulette.getBounds().width / 2;
        this.roulette.regY = this.roulette.getBounds().height / 2;

        this.roulette.x = this.canvas.nativeElement.width - this.roulette.regX;
        this.roulette.y = this.canvas.nativeElement.height - this.roulette.regY;
        this.roulette.scaleX = .9;
        this.roulette.scaleY = .9;
        this.stage.addChild(this.roulette);        
    }

    /**
     * 
     * @param loop number of 360 degree loops
     */
    private runRoullete(loop: number) {
        if(this.spining) {
            return;
        }

        this.pickedCards.filter(function(card){
            card.disableCard();
        })
        if(!this.spinText) {
            this.spinText = new createjs.Text(`Spining ${loop} times`, 'Arial', 'white');
            this.spinText.scaleX = 2;
            this.spinText.scaleY = 2;
            // this.text.alpha = 0.2;
            this.stage.addChild(this.spinText);
        } else {
            this.spinText.text = `Spining ${loop} times`;
        }

        this.spining = true;
        let loopCount = 0;
        createjs.Tween.get(this.roulette, { loop: loop }).to({
            rotation: 360 //or we can do 360 multiply by loop:number to get same result
        }, 1000).call((tween) => {
            loopCount++;
            if (loopCount === loop) {
                tween.setPaused(true);
                this.spining = false;
                this.pickedCards.filter(function(card){
                    card.enableCard();
                })
            }
        })
    }
}
