import {Component, ElementRef, Input} from '@angular/core';
import * as joint from 'jointjs';
import * as jQuery from 'jquery';
import {ComponentType} from "../../models/base/enums";
import {RelationData} from "./helper-classes.component";
//import * as cyto from 'ngx-cytoscape';
//import * as cytoscape from 'cytoscape';


@Component({
  template: '<div id="cytoscape"></div>',
  selector: 'relationDependencyComponent'
})
export class DependencyRelationCanvasComponent {

  @Input() private elements: any;
  @Input() private style: any;
  @Input() private layout: any;

  private jgraph: joint.dia.Graph;
  private logicalLinkAttributes: joint.dia.Link.Attributes;
  private synchronComLinkAttributes: joint.dia.Link.Attributes;
  private asynchronComLinkAttributes: joint.dia.Link.Attributes;
  private paperOptions: joint.dia.Paper.Options;
  private serviceModel: joint.shapes.devs.ModelAttributes;
  private instanceModel: joint.shapes.devs.ModelAttributes;
  private hardwareModel: joint.shapes.devs.ModelAttributes;
  private activityModel: joint.shapes.devs.ModelAttributes;
  private jpaper: joint.dia.Paper;
  private relationData: RelationData;

  readonly paperHeight = 150;
  readonly paperWidth = 770;

  constructor(private elementRef: ElementRef) {
  }

  public getGraph(): joint.dia.Graph {
    return this.jgraph
  }

  public initGraph(relationData: RelationData, jsonObject?) {

    const element = jQuery(this.elementRef.nativeElement).children().first();

    /*
    let cs = cytoscape({
      container: document.getElementById('cytoscape') // container to render in
    });
    */

    //let cytograph = new cyto.CytoscapeComponent(this.elementRef);



    /*
    this.jgraph = new joint.dia.Graph;
    this.initJointMembers();
    this.jpaper = new joint.dia.Paper(this.paperOptions);
    this.relationData = relationData;
    this.fromRelationData();
    this.resetLayout();
    */
  }

  public resetLayout(): void {
    joint.layout.DirectedGraph.layout(this.jgraph, {
      rankDir: 'LR'
    });
  }

  public fromRelationData() {

    const comp1 = this.createComponent(this.relationData.callerTypeLabel, this.relationData.callerLabel);
    const comp2 = this.createComponent(this.relationData.calleeTypeLabel, this.relationData.calleeLabel);

    let portIn1 = {
      id: 'inPort1', // generated if `id` value is not present
      group: 'in',
      args: {name: 'left'}, // extra arguments for the port layout function, see `layout.Port` section
      label: {
        position: {
          name: 'left'
        },
        markup: '<text class="label-text" fill="blue"/>'
      },
      attrs: { text: { text: 'portIn' } },
      markup: '<rect width="16" height="16" x="-8" strokegit ="red" fill="red"/>'
    };

    let portOut1 = {
      id: 'outPort1', // generated if `id` value is not present
      group: 'out',
      args: {name: 'right'}, // extra arguments for the port layout function, see `layout.Port` section
      label: {
        position: {
          name: 'right',
          args: { y: 6 } // extra arguments for the label layout function, see `layout.PortLabel` section
        },
        markup: '<text class="label-text" fill="blue"/>'
      },
      attrs: { text: { text: 'portOut' } },
      markup: '<rect width="16" height="16" x="-8" strokegit ="red" fill="blue"/>'
    };

    let portIn2 = {
      id: 'inPort2', // generated if `id` value is not present
      group: 'in',
      args: {name: 'left'}, // extra arguments for the port layout function, see `layout.Port` section
      label: {
        position: {
          name: 'left'
        },
        markup: '<text class="label-text" fill="blue"/>'
      },
      attrs: { text: { text: 'portIn' } },
      markup: '<rect width="16" height="16" x="-8" strokegit ="red" fill="red"/>'
    };

    let portOut2 = {
      id: 'outPort2', // generated if `id` value is not present
      group: 'out',
      args: {name: 'right'}, // extra arguments for the port layout function, see `layout.Port` section
      label: {
        position: {
          name: 'right',
          args: { y: 6 } // extra arguments for the label layout function, see `layout.PortLabel` section
        },
        markup: '<text class="label-text" fill="blue"/>'
      },
      attrs: { text: { text: 'portOut' } },
      markup: '<rect width="16" height="16" x="-8" strokegit ="red" fill="blue"/>'
    };

    //comp1.addPort(portIn1);
    comp1.addPort(portOut1);
    comp2.addPort(portIn2);
    //comp2.addPort(portOut2);

    const link = new joint.shapes.devs.Link({
      source: {id: comp1.id, port: comp1.getPort('outPort1')},
      target: {id: comp2.id, port: comp1.getPort('inPort2')},
      attrs: {
        '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'},
        'own': {link: true},
        '.link-tools': {display: 'none'}
      }
    });

    if (this.relationData.callerTypeLabel === 'Service') {
      link.appendLabel({
        attrs: {
          text: {
            text: this.relationData.relation.getAnnotation('http.path')
          }
        },
        position: {
          offset: 5
        }
      });
      link.appendLabel({
        attrs: {
          text: {
            text: '(' + this.relationData.relation.getAnnotation('mvc.controller.class') + ')'
          }
        },
        position: {
          offset: 20
        }
      });
      /*
      if (this.relationData.relation.getAnnotation('ad.async') === 'true') {
        link.attr('.connection', {stroke: 'black', 'stroke-dasharray': '5 2'});
      } else {
        link.attr('.connection', {stroke: 'black'});
      }
      */
    }

    if (link != null) {
      link.addTo(this.jgraph);
    }


  }

  public createComponent(typeName: string, labelName: string): joint.shapes.devs.Atomic {
    const parentElement = jQuery(this.elementRef.nativeElement).parent();
    let shape = null;

    if (ComponentType[typeName] === 'Activity') {
      shape = new joint.shapes.devs.Atomic(this.activityModel);
    } else if (ComponentType[typeName] === 'Hardware') {
      shape = new joint.shapes.devs.Atomic(this.hardwareModel);
    } else if (ComponentType[typeName] === 'Instance') {
      shape = new joint.shapes.devs.Atomic(this.instanceModel);
    } else {
      shape = new joint.shapes.devs.Atomic();
    }
    shape.attr('text/text', labelName);
    shape.set('model.type', ComponentType[typeName]);
    shape.set('model.id', labelName);
    //shape.set('link', 'null');
    shape.set('id', labelName);
    this.jgraph.addCell(shape);

    return shape;
  }

  private initJointMembers() {

    this.synchronComLinkAttributes = {
      attrs: {
        '.connection': {stroke: 'black'},
        // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
        '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'}
      }
    };

    this.asynchronComLinkAttributes = {
      attrs: {
        '.connection': {stroke: 'black', 'stroke-dasharray': '5 2'},
        // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
        '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'}
      }
    };

    this.logicalLinkAttributes = {
      attrs: {
        '.connection': {stroke: 'black'}
        // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
        //'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
      }
    };

    const element = jQuery(this.elementRef.nativeElement).children().first();
    const parentElement = jQuery(this.elementRef.nativeElement).parent();

    this.paperOptions = <any>{
      el: element,
      height: this.paperHeight,
      width: this.paperWidth,
      model: this.jgraph
    };

    const activityModelSize = {width: 200, height: 60};

    this.serviceModel = {
      position: { x: 250, y: 60 },
      size: activityModelSize,
      inPorts: ['in'],
      outPorts: ['out'],
      ports: {
        groups: {
          'in': {
            position: {
              name: 'left'
            },
            attrs: {
              '.port-body': {
                fill: '#16A085',
                magnet: 'passive'
              }
            }
          },
          'out': {
            position: {
              name: 'right'
            },
            attrs: {
              '.port-body': {
                fill: '#E74C3C'
              }
            }
          }
        }
      },
      attrs: {
        rect: { fill: '#00345b', 'stroke-width': 0, rx: 4, ry: 4 },
        text: {
          text: '', fill: '#fff', 'font-size': 12, 'text-anchor': 'middle', 'ref-x': 0.5, 'y': activityModelSize.height / 2 - 6
        },
        circle: {
          cx: 0, cy: 0, r: 40, fill: 'red'
        }
      }
    };

    this.activityModel = {
      position: {x: 0, y: 0},
      size: activityModelSize,
      attrs: {
        rect: {fill: '#055A00', 'stroke-width': 0, rx: 4, ry: 4},
        text: {
          text: '',
          fill: '#fff',
          'font-size': 12,
          'text-anchor': 'middle',
          'ref-x': 0.5,
          'y': activityModelSize.height / 2 - 6
        },
        circle: {
          cx: 0, cy: 0, r: 40, fill: 'red'
        }
      }
    };
    this.instanceModel = {
      position: {x: 0, y: 0},
      size: activityModelSize,
      attrs: {
        rect: {fill: '#397CBC', 'stroke-width': 0, rx: 4, ry: 4},
        text: {
          text: '',
          fill: '#fff',
          'font-size': 12,
          'text-anchor': 'middle',
          'ref-x': 0.5,
          'y': activityModelSize.height / 2 - 6
        },
        circle: {
          cx: 0, cy: 0, r: 40, fill: 'red'
        }
      }
    };

    this.hardwareModel = {
      position: {x: 0, y: 0},
      size: activityModelSize,
      attrs: {
        rect: {fill: '#6A3131', 'stroke-width': 0, rx: 4, ry: 4},
        text: {
          text: '',
          fill: '#fff',
          'font-size': 12,
          'text-anchor': 'middle',
          'ref-x': 0.5,
          'y': activityModelSize.height / 2 - 6
        },
        circle: {
          cx: 0, cy: 0, r: 40, fill: 'red'
        }
      }
    };
  }
}
