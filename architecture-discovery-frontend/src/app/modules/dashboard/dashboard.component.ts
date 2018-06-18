import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as cytoscape from 'cytoscape';
import * as dagre from 'cytoscape-dagre';
import { ComponentService } from 'app/modules/dashboard/services/component.service';
import { ComponentType } from '../../models/base/enums';
import { RelationService } from './services/relation.service';
import { GraphComponent } from './models/graphComponent';
import { IncidentService } from './services/incident.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private cy;
  public entities: {name: string, entities: GraphComponent[]}[] = [];
  public graphSettings = {domainRelations: true};
  public status: { isopen: boolean } = { isopen: false };
  public selection: {from: Number, to: Number, min: moment.Moment, max: moment.Moment} = {
    from: 5,
    to: null,
    min: moment('11/29/2010', 'MM/DD/YYYY'),
    max: moment('11/29/2011', 'MM/DD/YYYY')
  };

  /*
  public currentSessions = [
    {user: {name: 'User XYZ', id: 1}, time: moment().subtract(50, 'm')},
    {user: {name: 'User ABC', id: 2}, time: moment().subtract(50, 's')},
    {user: {name: 'User Max', id: 3}, time: moment().subtract(150, 's')},
    {user: {name: 'User Kevin', id: 4}, time: moment().subtract(200, 'm')}
  ].sort((a, b) => b.time.diff(a.time));
  */


  public problems;
  public prettifyFn = a => moment(a, 'X').format('YYYY/MM/DD');
  constructor(private router: Router, private componentService: ComponentService, private relationService: RelationService,
    private incidentService: IncidentService ) {
  }

  public buildBPChart() {
    let nodes = [];
    let edges = [];
    let products: GraphComponent[];
    let domains: GraphComponent[];

    domains = this.componentService.getAllDomains();
    products = domains.reduce((acc, domain) => acc.concat(domain.children), []);

    nodes = [...domains, ...products].map(node => node.getGraphNode());

    this.entities = [
      {name: 'Domains', entities: domains},
      {name: 'Products', entities: products}
    ];

    // get and transform relation objects according to aggregation strategy
    if (this.graphSettings.domainRelations) {
      edges = this.relationService.getAllRelations().map(rel => {
        let source: number;
        let target: number;
        source = this.componentService.getComponentById(this.componentService.getComponentById(rel.source).parent).parent;
        target = this.componentService.getComponentById(this.componentService.getComponentById(rel.target).parent).parent;
        return {'data': {source: source, target: target, id: rel.id}};
      })
    } else {
      edges = this.relationService.getAllRelations().map(rel => {
        let source: number;
        let target: number;
        source = this.componentService.getComponentById(rel.source).parent;
        target = this.componentService.getComponentById(rel.target).parent;
        return {'data': {source: source, target: target, id: rel.id}};
      })
    }

    console.log(edges);
    edges = edges.filter((rel, index, self) =>
      rel.data.source !== rel.data.target &&
      self.findIndex(search => search.data.source === rel.data.source && search.data.target === rel.data.target) === index);
    // remove edges targeting their source and remove duplicate edges
    console.log(edges);
    cytoscape.use( dagre );
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes: nodes,
        edges: edges
      },
      layout: {
        name: 'grid',
        rankDir: 'LR',
      },
      style: [{
        selector: 'node',
        style: {
          'label': 'data(title)',
          'width': '100%',
          'font-size': '10px',
          'text-valign': 'center',
          'shape': 'rectangle'
        }
      }, {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'unbundled-bezier',
        }
      }, {
        selector: '.' + ComponentType.Domain,
        style: {
          'text-valign': 'top',
          'padding': '20px',
          'text-margin-y': '18px',
          'font-size': 12,
        }
      }, {
        selector: '.highlight',
        style: {
          'border-color': '#827f0b',
          'border-width': '3px',
          'background-color': '#c5c10f',
        }
      }, {
        selector: '.error',
        style: {
          'border-color': 'red',
          'border-width': '3px',
          'background-color': 'pink',
        }
      }
    ]
    });
    this.cy.on('tap', 'node', event => this.router.navigate(['/service', event.target.id()]));
  }

  ngOnInit(): void {
    this.buildBPChart();
    this.incidents();
  }

  public exportGraph() {
    window.open(this.cy.png({bg: 'white'}).replace(/^data:image\/[^;]+/, 'data:application/octet-stream'));
  }

  public incidents() {
    this.incidentService.getAllIncidents().then(incidents => this.problems = incidents.sort((a, b) => b.time.diff(a.time)));
  }

  public resetZoom() {
    this.cy.fit();
  }

  public highlightNode(entity: GraphComponent) {
    this.cy.$('#' + entity.id).addClass('highlight');
  }

  public highlightNodeOff(entity: GraphComponent) {
    this.cy.$('#' + entity.id).removeClass('highlight');
  }


  public errorNode(id: number) {
    this.cy.$('#' + id).addClass('error');
  }

  public errorNodeOff(id: GraphComponent) {
    this.cy.$('#' + id).removeClass('error');
  }
}
