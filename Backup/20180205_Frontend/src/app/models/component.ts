import { ComponentType } from "app/models/base/enums";
import { AnnotationBase } from "app/models/base/annotationBase";

export class Component extends AnnotationBase {
    private _id: number;
    private _type: ComponentType;
    private _name: string;


	constructor(type: ComponentType) {
        super();
		this.type = type;
	}

    public static deserialize(object: any): Component {
        let component: Component = new Component(object.type);
		component.deserializeAnnotations(object);
        component.id = object.id;
        component._name = object.name;
        return component;
    }

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}
    
	public get type(): ComponentType {
		return this._type;
	}

	public set type(value: ComponentType) {
        if(isNaN(value))
            value = <any>ComponentType[value];
		this._type = value;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}
	
}