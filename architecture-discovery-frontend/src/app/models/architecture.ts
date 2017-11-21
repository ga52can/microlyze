import { Revision } from "app/models/revision";

export class Architecture {
    private _snapshot: number;
    private _components: Map<number, Revision>;
    private _rootComponents: Array<number>;

    public static deserialize(object: any): Architecture {
        let architecture: Architecture = new Architecture();
        architecture._snapshot = object.snapshot;
        architecture._rootComponents = object['root-components'];
        architecture._components = new Map<number, Revision>();
        for(let key in object.components) {
            const id: number = Number.parseInt(key);
            architecture._components.set(id, Revision.deserializeWithId(id, object.components[key]))
        }
        return architecture;
    }


	public get snapshot(): number {
		return this._snapshot;
	}

	public set snapshot(value: number) {
		this._snapshot = value;
	}

	public get components(): Map<number, Revision> {
		return this._components;
	}

	public set components(value: Map<number, Revision>) {
		this._components = value;
	}
    
	public get rootComponents(): Array<number> {
		return this._rootComponents;
	}

	public set rootComponents(value: Array<number>) {
		this._rootComponents = value;
	}
    
}