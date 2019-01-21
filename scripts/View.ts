/// <reference path="../typings/index.d.ts" />
import { Model } from "./Model";

export class View {
    private _model: Model;
    private _container: JQuery;
    private _toggle: JQuery;
    private _toggleLabel: JQuery;
    private _slider: JQuery;
    private _slider1: JQuery;
    private _slider2: JQuery;

    constructor(model: Model, private onToggle: Function, private toggleToTrue: Function, private toggleToFalse: Function) {
        this._model = model;
        this.create();
    }

    public create(): void {
        // this._container = $("<div role='button'> </div>");
        // this._container.addClass("container");
        // this._container.attr("tabindex", "0");

        // this._toggle = $("<div> </div>");
        // this._toggle.addClass("toggle");

        // this._toggleLabel = $("<div> </div>");
        // this._toggleLabel.addClass("toggleLabel");

        // this._slider = $("<div> </div>");
        // this._slider.addClass("slider");

        // $("body").empty().append(this._container);


       
        this._container = $("<div role='textbox'> </div>");
        this._container.addClass("container");
        this._container.attr("tabindex", "0");

        this._toggle = $("<div> </div>");
        this._toggle.addClass("wrap");

        this._toggleLabel = $("<div> </div>");
        this._toggleLabel.addClass("option1");

        // <input type="text" id="witc_17_txt" autocomplete="off" title="" maxlength="255" aria-invalid="false" aria-expanded="false" role="combobox" aria-autocomplete="both">
        // this._slider =  $("<div class='workitemcontrol work-item-control initialized'><divclass='combo input-text-box list text emptyBorder'><div class='wrap'  id='severity'><input type='text' value='111' class='severity' autocomplete='off' title='' maxlength='255' aria-invalid='false'></div><div class='drop bowtie-icon bowtie-chevron-down-light' role='button' aria-label='Expand'></div></div></div>");
        // this._slider1 = $("<div class='workitemcontrol work-item-control initialized'><divclass='combo input-text-box list text emptyBorder'><div class='wrap' id='severity'><input type='text' value='222' class='severity2' autocomplete='off' title='' maxlength='255' aria-invalid='false'></div><div class='drop bowtie-icon bowtie-chevron-down-light' role='button' aria-label='Expand'></div></div></div>");
        // this._slider2 = $("<div class='workitemcontrol work-item-control initialized'><divclass='combo input-text-box list text emptyBorder'><div class='wrap' id='severity'><input type='text' value='333' class='severity3' autocomplete='off' title='' maxlength='255' aria-invalid='false'></div><div class='drop bowtie-icon bowtie-chevron-down-light' role='button' aria-label='Expand'></div></div></div>");

        this._slider =  $("<input type='text' value='111' class='severity' autocomplete='off' title='' maxlength='255' aria-invalid='false'>");
        this._slider1 = $("<input type='text' value='222' class='severity2' autocomplete='off' title='' maxlength='255' aria-invalid='false'>");
        this._slider2 = $("<input type='text' value='333' class='severity3' autocomplete='off' title='' maxlength='255' aria-invalid='false'>");
        

        $("body").empty().append(this._container);


        $(this._container).empty().append(this._toggle);
        $(this._container).append(this._toggleLabel);
        $(this._toggle).append(this._slider);
        $(this._toggle).append(this._slider1);
        $(this._toggle).append(this._slider2);

        this.refresh();

        // allows user to click, keyleft, keyright and space to change the selected value.
        $(document).click(() => {
            this.onToggle();
        }).bind("keydown", (evt: JQueryKeyEventObject) => {
            if (evt.keyCode === 32) {
                this.onToggle();
            } else if (evt.keyCode === 39) {
                // left key
                this.toggleToTrue();
            } else if (evt.keyCode === 37) {
                // right key
                this.toggleToFalse();
            }
        });
    }

    public refresh(): void {
        if (this._model.getToggleState()) {
            this._toggle.addClass("on");
            this._container.attr("aria-pressed", "true");
        } else {
            this._toggle.removeClass("on");
            this._container.attr("aria-pressed", "false");
        }
        this.showInfo();
    }

    private showInfo(): void {
        $(this._toggleLabel).empty().text(this._model.getLabel());
        $(this._container).attr("title", this._model.getFieldLabel() +
            ": Value = " + this._model.getToggleState() + ", " + "Label = " + this._model.getLabel());
    }
}
