import { Component } from "app/models/component";
import { Relation } from "app/models/relation";
import { AnnotationBase } from "app/models/base/annotationBase";


export class Revision extends AnnotationBase {
	private _id: number;
	private _component: Component;
	private _childRelations: Array<Relation> = new Array();
	private _parentRelations: Array<Relation> = new Array();

	public static deserialize(object: any): Revision {
		return this.deserializeWithId(Number.parseInt(object.id), object);
	}

	public static deserializeWithId(id: number, object: any): Revision {
		const component: Component = Component.deserialize(object.component);
		let revision: Revision = new Revision(component);
		revision.id = id;
		revision.deserializeAnnotations(object);
		if (object['child-relations'])
			for (let relation of object['child-relations']) {
				relation.owner = id;
				let relationObj = Relation.deserialize(relation);
				if (!relationObj.caller)
					relationObj.caller = id;
				revision.childRelations.push(relationObj);
			}

		if (object['parent-relations'])
			for (let relation of object['parent-relations']) {
				relation.callee = id;
				let relationObj = Relation.deserialize(relation);
				if (!relationObj.owner)
					relationObj.owner = relationObj.caller;
				revision.parentRelations.push(relationObj);
			}
		return revision;
	}

	public setFromObject(revision: Revision) {
		this.id = revision.id;
		this.component = revision.component;
		this.parentRelations = revision.parentRelations;
		this.childRelations = revision.childRelations;
	}

	constructor(component: Component) {
		super();
		this._component = component;
	}

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get component(): Component {
		return this._component;
	}

	public set component(value: Component) {
		this._component = value;
	}

	public get childRelations(): Array<Relation> {
		return this._childRelations;
	}

	public set childRelations(value: Array<Relation>) {
		this._childRelations = value;
	}

	public get parentRelations(): Array<Relation> {
		return this._parentRelations;
	}

	public set parentRelations(value: Array<Relation>) {
		this._parentRelations = value;
	}
}