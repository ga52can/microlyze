import { AnnotationBase } from "app/models/base/annotationBase";
import { Relation } from "app/models/relation";

export class ModeledRelation extends AnnotationBase {
	private _id: number;
    private _caller: number;
    private _callee: number;
	private _validFrom: number;
	private _validTo: number;

    public static deserialize(object: any): ModeledRelation {
        let modeledRelation: ModeledRelation = new ModeledRelation();
		modeledRelation.deserializeAnnotations(object);
        modeledRelation._caller = object.caller;
        modeledRelation._callee = object.callee;
		modeledRelation._id = object.id;
		modeledRelation._validFrom = object.validFrom;
		modeledRelation._validTo = object.validTo;
        return modeledRelation;
    }

	public toRelation(): Relation {
		let relation = new Relation();
		relation.owner = this.caller;
		relation.caller = this.caller;
		relation.callee = this.callee;
		return relation;
	}

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get caller(): number {
		return this._caller;
	}

	public set caller(value: number) {
		this._caller = value;
	}

	public get callee(): number {
		return this._callee;
	}

	public set callee(value: number) {
		this._callee = value;
	}

	public get validFrom(): number {
		return this._validFrom;
	}

	public set validFrom(value: number) {
		this._validFrom = value;
	}

	public get validTo(): number {
		return this._validTo;
	}

	public set validTo(value: number) {
		this._validTo = value;
	}

}