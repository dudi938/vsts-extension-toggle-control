
import * as WitService from "TFS/WorkItemTracking/Services";
import * as WitContracts from "TFS/WorkItemTracking/Contracts";
import { WorkItemField } from "TFS/WorkItemTracking/Contracts";
import { FieldType } from "TFS/WorkItemTracking/Contracts";
import { InputParser } from "./InputParser";
import { Model } from "./Model";
import { View } from "./View";
import { ErrorView } from "./ErrorView";
import * as Q from "q";
import { IToggleConfiguration } from "./ToggleContracts";

export class Controller {
    private _fieldLabel: string = "";
    private _fieldName: string = "";
    private _model: Model;
    private _view: View;
    private _inputs: IToggleConfiguration = {
        FieldName: "",
        TrueLabel: "",
        FalseLabel: ""
    };

    constructor() {
        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._fieldName = InputParser.getFieldName(this._inputs);
        WitService.WorkItemFormService.getService().then(
            (service) => {
                this._getValues(service).then(
                    ({allowedValues, currentValue, fields}) => {
                        const { isBoolean, fieldLabel } = this._getFieldInformation(this._fieldName, fields);
                        let options = InputParser.getOptions(this._inputs, allowedValues, isBoolean);
                        this._fieldLabel = fieldLabel;
                        this._model = new Model(this._fieldLabel, options, currentValue);
                        this._view = new View(this._model, () => {
                            console.log('DEBUG allwed values : ' + allowedValues)
                            this._model.toggle();
                            this._updateInternal();
                        }, () => {
                            this._model.toggleToTrueState();
                            this._updateInternal();
                        }, () => {
                            this._model.toggleToFalseState();
                            this._updateInternal();
                        });
                    }, this._handleError
                ).then(null, this._handleError);
            },
            this._handleError);
    }

    private _getValues(service: WitService.IWorkItemFormService): Promise<{allowedValues: any[], currentValue: boolean, fields: WitContracts.WorkItemField[]}> {
        return service.getAllowedFieldValues(this._fieldName).then((allowedValues) => 
            service.getFieldValue(this._fieldName).then((currentValue: boolean) => 
                service.getFields().then((fields) => ({allowedValues, currentValue, fields}))));
        
    }

    private _getFieldInformation(fieldname: string, fields: WitContracts.WorkItemField[]): { isBoolean: boolean, fieldLabel: string } {
        for (let field of fields) {
            if (field.referenceName === fieldname) {
                if (field.type === FieldType.Boolean) {
                    return { isBoolean: true, fieldLabel: field.name };
                }
                return { isBoolean: false, fieldLabel: field.name };
            }
        }
        throw "Field not found.";
    }

    private _handleError(error: string): void {
        new ErrorView(error);
    }

    private _updateInternal(): void {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(this._fieldName, this._model.getToggleState()).then(
                    () => {
                        this._view.refresh();
                    }, this._handleError);
            },
            this._handleError
        );
    }

    public updateExternal(value: boolean): void {
        this._model.setSelectedValue(value);
        this._view.refresh();
    }

    public getFieldName(): string {
        return this._fieldName;
    }
}
