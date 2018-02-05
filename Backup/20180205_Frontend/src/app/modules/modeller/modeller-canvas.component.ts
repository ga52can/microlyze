import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery';
import * as backbone from 'backbone';


@Component({
    template: '<div id="paper"></div>',
    selector: 'modeller-canvas-component'
})
export class ModellerCanvasComponent implements OnInit {

    @Output() onActivityDblClicked = new EventEmitter<joint.shapes.devs.Atomic>();
    @Output() onActivityRemoved = new EventEmitter<joint.shapes.devs.Atomic>();
    @Output() onGraphChanged = new EventEmitter<void>();

    private elementRef: ElementRef;

    private graph: joint.dia.Graph;
    private linkAttributes: joint.dia.LinkAttributes;
    private paperOptions: joint.dia.PaperOptions;
    private startModel: joint.shapes.devs.ModelAttributes;
    private endModel: joint.shapes.devs.ModelAttributes;
    private activityModel: joint.shapes.devs.ModelAttributes;

    private startCell: joint.dia.Cell;

    readonly paperHeight = 1200;

    constructor(myElement: ElementRef) {

        this.elementRef = myElement;
    }

    ngOnInit() {
        this.graph = new joint.dia.Graph;
        this.initJointMembers();

        const paper: joint.dia.Paper = new joint.dia.Paper(this.paperOptions);
        this.initGraph(null);

        paper.on('cell:pointerdblclick', function(cellView) {
            if (cellView.model.get('model.type') === 'activity') {
                this.onActivityDblClicked.emit(cellView.model);
                return;
            }
        }.bind(this));

        paper.on('cell:contextmenu', function(cellView) {
            if (cellView.model.get('model.type') === 'activity') {
                this.onActivityRemoved.emit(cellView.model);
                this.graph.removeCells([cellView.model]);
                return;
            }
        }.bind(this));

        this.graph.on('all', function(eventName, cell) {
            this.onGraphChanged.emit();
        }.bind(this));

    }

    public getGraph(): joint.dia.Graph {
        return this.graph
    }

    public initGraph(jsonObject?) {
        this.graph.clear();
        if (jsonObject && jsonObject != null) {
            this.graph.fromJSON(jsonObject)
        } else {
            this.graph.addCells([new joint.shapes.devs.Atomic(this.startModel), new joint.shapes.devs.Atomic(this.endModel)]);
        }
        for(let cell of this.graph.getCells()) {
            if (cell.getAncestors().length == 0){
                this.startCell = cell;
                break;
            }
        }

        const element = jQuery(this.elementRef.nativeElement).parent();
        jQuery(element).scrollLeft(((<any>jQuery(element)[0]).scrollWidth - jQuery(element).width())/2 + 8);
    }

    public getStartCell(): joint.dia.Cell {
        return this.startCell;
    }

    public createActivity(activityName: String, positionX?: number, positionY?: number) {
        const parentElement = jQuery(this.elementRef.nativeElement).parent();
        positionX = (positionX != null) ? positionX : parentElement.width() - this.activityModel.size.width - 20;
        positionY = (positionY != null) ? positionY : parentElement.scrollTop();
        const shape = new joint.shapes.devs.Atomic(this.activityModel);
        shape.attr('text/text', activityName);
        shape.translate(positionX, positionY);
        shape.set('model.id', 5);
        shape.set('model.type', 'activity');
        this.graph.addCell(shape);
        return shape;
    }

    public renameActivity(activity: joint.shapes.devs.Atomic, text: string) {
        const wraptext = joint.util.breakText(text,
            { width: this.activityModel.size.width - 10, height: this.activityModel.size.height }, <any>this.activityModel.attrs.text);

        const lines = wraptext.split('\n').length;
        activity.attr('text/text', wraptext);
        activity.attr('text/y', (this.activityModel.size.height - lines * <any>this.activityModel.attrs.text['font-size']) / 2);
    }

    private initJointMembers() {

        this.linkAttributes = {
            attrs: {
                '.connection': { stroke: 'black' },
                // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
            }
        }

        const element = jQuery(this.elementRef.nativeElement).children().first();
        const parentElement = jQuery(this.elementRef.nativeElement).parent();

        this.paperOptions = <any>{
            el: element,
            height: this.paperHeight,
            drawGrid: { name: 'mesh', args: { color: '#ddd' } },
            width: 2000,
            gridSize: 10,
            model: this.graph,
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                if (magnetS && magnetS.getAttribute('port-group') === 'in') { return false };
                if (cellViewS === cellViewT) { return false };
                return magnetT && magnetT.getAttribute('port-group') === 'in';
            },
            defaultLink: new joint.dia.Link(this.linkAttributes),
            linkPinning: false
        }

        const activityModelSize = { width: 200, height: 60 };
        this.activityModel = {
            position: { x: 0, y: 0 },
            size: activityModelSize,
            inPorts: [''],
            outPorts: [' '],
            ports: {
                groups: {
                    'in': {
                      z: 0,
                      label: {
                        position: 'top',
                      },
                      attrs: {
                          '.port-body': {
                              fill: '#16A085',
                              magnet: 'passive'
                          }
                      }
                    },
                    'out': {
                        z: 0,
                      label: {
                        position: 'bottom',
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
        }

        const startModelSize = { width: 100, height: 40 };
        this.startModel = {
            position: { x: this.paperOptions.width / 2 - startModelSize.width / 2, y: 0 },
            size: startModelSize,
            outPorts: [' '],
            ports: {
                groups: {
                    'out': {
                        z: 0,
                        label: {
                          position: 'bottom',
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
                '.label': { text: 'Start', 'ref-x': .5, 'ref-y': .3, fill: '#fff' },
                rect: { fill: '#666', 'stroke-width': 0, rx: 16, ry: 16 }
            }
        }

        const endModelSize = { width: 100, height: 40 };
        this.endModel = {
            position: { x: this.paperOptions.width / 2 - endModelSize.width / 2, y: parentElement.height() - 41 - endModelSize.height },
            size: endModelSize,
            inPorts: [''],
            ports: {
                groups: {
                    'in': {
                        z: 0,
                        label: {
                          position: 'top',
                        },
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                                magnet: 'passive'
                            }
                        }
                    },
                }
            },
            attrs: {
                '.label': { text: 'End', 'ref-x': .5, 'ref-y': .3, fill: '#fff' },
                rect: { fill: '#666', 'stroke-width': 0, rx: 16, ry: 16 }
            }
        }
    }
}
