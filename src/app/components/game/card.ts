import * as createjs from 'createjs-module';
import Helper from '../../utils/helper';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
export default class Card extends createjs.Sprite {

    public id: number;

    /**
     * 
     */
    public enabled: boolean = true;

    /**
     * 
     */
    private loader: any;

    /**
     * 
     */
    private helper:any;

    /**
     * 
     */
    private picked:boolean = false;

    /**
     * 
     */
    private flipped:boolean = false;

    /**
     * Subscribe to this observer to receive pick request event
     */
    private pickObserver:Observer<any>;

    /**
     * * Subscribe to this observer to receive flip request event
     */
    private flipObserver:Observer<any>;

    /**
     * Subscribe to this observer to receive mouseover event
     */
    private hoverObserver:Observer<any>;

    /**
     * 
     */
    private nominal:number = null;

    constructor(Helper:Helper, loader?: any, id?: number) {
        
        super(loader.getResult("cards"));
        
        this.helper = Helper;
        
        this.on("mouseover", () => {
            if(!this.enabled) {
                return;
            }
            if(this.hoverObserver) {
                this.hoverObserver.next(this);
            }
        });
        
        /**
         * Setup click listener and observers
         */
        this.on("click", () => {
            if(this.picked && !this.flipped) {
                this.flipCard();
            }
            if(!this.picked) {
                this.pickCard();
            }           
        })
    }

    /**
     * disable card
     */
    public enableCard() {
        this.enabled = true;
        this.alpha = 1;
    }

    /**
     * enable card
     */
    public disableCard() {
        this.enabled = false;
        this.alpha = 0.5;
    }

    public setNominal(num:number) {
        this.nominal = num;
    }

    public getNominal() :number {
        return this.nominal;
    }
    /**
     * 
     */
    public isPicked() {
        return this.picked;
    }

    /**
     * 
     */
    public isFlipped() {
        return this.flipped;
    }
    
    /**
     * 
     */
    public onCardHover() : Observable<any> {
        return new Observable(observer => {
            this.hoverObserver = observer;
        })
    }

    /**
     * 
     */
    public onCardPick() : Observable<any> {
        return new Observable(observer => {
            this.pickObserver = observer;
        })
    }

    /**
     * 
     */
    public onCardFlip() : Observable<any> {
        return new Observable(observer => {
            this.flipObserver = observer;
        })
    }

    /**
     * 
     */
    private flipCard() {
        if(!this.enabled)
            return;
        this.flipped = true;
        this.flipObserver.next(this);
    }

    /**
     * 
     */
    private pickCard() {
        if(!this.enabled)
            return;
        this.picked = true;
        this.pickObserver.next(this);
    }

    /**
     * 
     * @param id 
     */
    public setId(id: number) {

        this.id = id;
        //Kinda Left pad :/
        const fixOctalError = this.id.toString().length == 1 ? `00${this.id}` : (this.id.toString().length == 2 ? `0${this.id}`: this.id);
        if (this.id.toString() == '000') {
            this.gotoAndStop(`back/${1}/c${fixOctalError}`);
        } else {
            this.gotoAndStop(`front/${1}/c${fixOctalError}`);
        }
    }
}