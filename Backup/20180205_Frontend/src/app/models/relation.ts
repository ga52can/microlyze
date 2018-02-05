import { AnnotationBase } from "app/models/base/annotationBase";

export class Relation extends AnnotationBase {
	private _id: number;
    private _owner: number;
    private _caller: number;
    private _callee: number;

    public static deserialize(object: any): Relation {
        let relation: Relation = new Relation();
		relation.deserializeAnnotations(object);
        relation._owner = object.owner;
        relation._caller = object.caller;
        relation._callee = object.callee;
		relation._id = object.id;
        return relation;
    }

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get owner(): number {
		return this._owner;
	}

	public set owner(value: number) {
		this._owner = value;
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
}