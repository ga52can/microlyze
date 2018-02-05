export class ComponentMapping {
    private _id: number;
	private _httpPathRegex: string;
	private _httpMethods: number;
	private _componentId: number;

    public static deserialize(object: any): ComponentMapping {
        let unmappedTrace: ComponentMapping = new ComponentMapping();
		unmappedTrace._id = object.id;
		unmappedTrace._httpPathRegex = object.httpPathRegex;
		unmappedTrace._httpMethods = object.httpMethods;
		unmappedTrace._componentId = object.component;
        return unmappedTrace;
    }

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get httpPathRegex(): string {
		return this._httpPathRegex;
	}

	public set httpPathRegex(value: string) {
		this._httpPathRegex = value;
	}

	public get httpMethods(): number {
		return this._httpMethods;
	}

	public set httpMethods(value: number) {
		this._httpMethods = value;
	}

	public get componentId(): number {
		return this._componentId;
	}

	public set componentId(value: number) {
		this._componentId = value;
	}
}