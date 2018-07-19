import { Component } from 'app/models/component'

export class GraphComponent extends Component {
  private _parent: number;
  private _children: Component[];
  private _start;
  private _end;

  public static deserialize(object: any): GraphComponent {
    let graphComponent: GraphComponent;
    graphComponent = new GraphComponent(object.type);
    graphComponent.deserializeAnnotations(object);
    graphComponent.id = object.id;
    graphComponent.name = object.name;
    graphComponent._parent = object.parent;
    return graphComponent;
}

public get parent(): number {
  return this._parent;
}

public set parent(value: number) {
  this._parent = value;
}

public getGraphNode() {
  return {
    'data': {
      'id': '' + this.id,
      'title': this.name,
      'parent': '' + this._parent
    },
    'classes': '' + this.type
  };
}


public get children(): Component[]{
  return this._children;
}

public set children(value: Component[]) {
  this._children = value;
}

public get start() {
  return this._start;
}

public set start(value) {
  this._start = value;
}

public get end() {
  return this._end;
}

public set end(value) {
  this._end = value;
}
}
