export class AnnotationBase {
    private _annotations: Map<string, string> = new Map<string, string>();
    private _changedAnnotations: Array<string> = new Array();

    protected deserializeAnnotations(object: any): void {
        this._annotations = new Map<string, string>();
		if(object['annotations']) {
            for(let annotationKey in object.annotations) {
                this._annotations.set(annotationKey, object.annotations[annotationKey]);
            }
        }
    }

    public getAnnotation(key: string): string {
        return this._annotations.get(key);
    }


    public setAnnotation(key: string, value: string): void {
        if(this.getAnnotation(key) != value){
            this._changedAnnotations.push(key);
            this._annotations.set(key, value);
        }
    }

    public setAnnotationsFromObject(annotationBase : AnnotationBase) {
        for(let annotationKey of Array.from(annotationBase._annotations.keys()))
            this._annotations.set(annotationKey, annotationBase.getAnnotation(annotationKey));

        for(let annotationKey of annotationBase._changedAnnotations)            
            this._changedAnnotations.push(annotationKey);
    }

    public get label(): string {
		return this.getAnnotation('ad.model.label');
	}

	public set label(value: string) {
		this.setAnnotation('ad.model.label', value);
	}
    
	public get changedAnnotations(): Array<string>  {
		return this._changedAnnotations;
	}

	public resetChangedAnnotations(): void  {
		this._changedAnnotations = new Array<string>();
    }
    

	public get annotations(): Map<string, string>  {
		return this._annotations;
	}
}