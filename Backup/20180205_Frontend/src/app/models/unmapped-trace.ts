import { ArchitectureElementOperation, ArchitectureElementType, HttpMethod } from "app/models/base/enums";
import { AnnotationBase } from "app/models/base/annotationBase";

export class UnmappedTrace {
    private _id: number;
	private _traceId: number;
	private _time: number;
	private _httpPath: string;
	private _httpMethod: HttpMethod;

    public static deserialize(object: any): UnmappedTrace {
        let unmappedTrace: UnmappedTrace = new UnmappedTrace();
		unmappedTrace._id = object.id;
		unmappedTrace._traceId = object.traceId;
		unmappedTrace._time = object.time;
		unmappedTrace._httpPath = object.httpPath;
		unmappedTrace._httpMethod = object.httpMethod;
		if(isNaN(unmappedTrace._httpMethod))
			unmappedTrace._httpMethod = <any>HttpMethod[unmappedTrace._httpMethod];

        return unmappedTrace;
    }

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get traceId(): number {
		return this._traceId;
	}

	public set traceId(value: number) {
		this._traceId = value;
	}

	public get time(): number {
		return this._time;
	}

	public set time(value: number) {
		this._time = value;
	}

	public get httpPath(): string {
		return this._httpPath;
	}

	public set httpPath(value: string) {
		this._httpPath = value;
	}

	public get httpMethod(): HttpMethod {
		return this._httpMethod;
	}

	public set httpMethod(value: HttpMethod) {
		this._httpMethod = value;
	}
	
}