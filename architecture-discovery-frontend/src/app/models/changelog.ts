import { ArchitectureElementOperation, ArchitectureElementType } from "app/models/base/enums";
import { AnnotationBase } from "app/models/base/annotationBase";

export class Changelog {
    private _referenceType: ArchitectureElementType;
    private _referenceId: number;
	private _time: number;
	private _operation: ArchitectureElementOperation;

    public static deserialize(object: any): Changelog {
        let changelog: Changelog = new Changelog();
		changelog._referenceId = object.referenceId;
		changelog._referenceType = object.referenceType;
		if(isNaN(changelog._referenceType))
            changelog._referenceType = <any>ArchitectureElementType[changelog._referenceType];
		changelog._time = object.time;
		changelog._operation = object.operation;
		if(isNaN(changelog._operation))
            changelog._operation = <any>ArchitectureElementOperation[changelog._operation];
        return changelog;
    }

	public get referenceType(): ArchitectureElementType {
		return this._referenceType;
	}

	public get referenceId(): number {
		return this._referenceId;
	}


	public get operation(): ArchitectureElementOperation {
		return this._operation;
	}

	public set operation(value: ArchitectureElementOperation) {
		this._operation = value;
	}

	public get time(): number {
		return this._time;
	}
}