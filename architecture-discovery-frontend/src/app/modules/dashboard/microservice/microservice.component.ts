import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '../services/component.service';
import * as cytoscape from 'cytoscape';
import * as dagre from 'cytoscape-dagre';
import { RepositoryService } from '../services/repository.service';
import { RelationService } from '../services/relation.service';
import { ComponentType } from 'app/models/base/enums';
import { GraphComponent } from '../models/GraphComponent';
import { OpenapiService } from '../services/openapi.service';

@Component({
  selector: 'app-microservice',
  templateUrl: './microservice.component.html',
  styleUrls: ['./microservice.component.scss']
})
export class MicroserviceComponent implements OnInit {
  componentId: number;
  public component: GraphComponent;
  public instances;
  public api;
  public relations;
  private nodes;
  private edges;
  private cy;
  public componentType = ComponentType;
  public graphSettings = {serviceRelations: true};
  public entities: {name: string, entities: GraphComponent[]}[];
  constructor(private route: ActivatedRoute, public componentService: ComponentService, private repository: RepositoryService,
    private relationService: RelationService, private router: Router, private openAPIService: OpenapiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.componentId = +params['id'];

      this.component = this.componentService.getComponentById(this.componentId);
      this.entities = [];

      switch (this.component.type) {
        case ComponentType.Domain:
          this.domainView();
          break;
        case ComponentType.Product:
          this.productView();
          break
        case ComponentType.Service:
          this.serviceView();
          break;
      }
    });
  }

  public domainView() {
    let products: GraphComponent[];
    let services: GraphComponent[];
    let relations;
    let externalProducts: GraphComponent[];
    let externalServices: GraphComponent[];

    this.entities = [];

    this.component = this.componentService.getComponentById(this.componentId);
    products = this.componentService.getChildren(this.component);
    services = products.reduce((acc, product) => acc.concat(this.componentService.getChildren(product)), []);
    relations = this.relationService.getRelationsByComponents(services.map(service => service.id));
    let graphNodes = [];
    let graphEdges = [];

    externalProducts = relations.externalNodes
      .map(node => this.componentService.getComponentById(node).parent)
      .filter((prod, index, arr) => arr.indexOf(prod) === index)
      .map(prod => this.componentService.getComponentById(prod));
    externalServices = relations.externalNodes.map(node => this.componentService.getComponentById(node));

    this.entities = [
      {name: 'Products', entities: products},
      {name: 'External Products', entities: externalProducts},
      {name: 'Services', entities: services},
      {name: 'External Services', entities: externalServices}
    ].filter(group => group.entities.length);

    graphNodes = [
      this.component.getGraphNode(), // Add Domain node
      ...products.map(product => product.getGraphNode()), // Add product nodes
      ...externalProducts.map(prod => prod.getGraphNode()), // add external products
      ...services.map(service => service.getGraphNode()), // Add services to nodes
      ...externalServices.map(service => service.getGraphNode()), // add services from other domains
    ];

    if (!this.graphSettings.serviceRelations) {
      graphEdges = [...relations.inbound, ...relations.inner, ...relations.outbound].map(rel => ({data: rel}));
    } else {
      console.log(relations);
      graphEdges = [
        ...relations.inner.map(rel => ({
          id: rel.id,
          source: this.componentService.getComponentById(rel.source).parent,
          target: this.componentService.getComponentById(rel.target).parent
        })),
        ...relations.inbound.map(rel => ({
          id: rel.id,
          source: rel.source,
          target: this.componentService.getComponentById(rel.target).parent
        })),
        ...relations.outbound.map(rel => ({
          id: rel.id,
          source: this.componentService.getComponentById(rel.source).parent,
          target: rel.target
        }))
      ]
      .filter((rel, index, arr) => arr.findIndex(search => search.target === rel.target && search.source === rel.source) === index)
      .map(rel => ({data: rel}))
    }
    console.log(graphNodes, graphEdges);
    this.renderGraph(graphNodes, graphEdges);

  }

  private productView() {
    let services: GraphComponent[];
    let externalServices: GraphComponent[];
    let relations;
    let graphNodes;
    let graphEdges;

    services = this.componentService.getChildren(this.component);
    relations = this.relationService.getRelationsByComponents(services.map(service => service.id));
    externalServices = relations.externalNodes.map(node => this.componentService.getComponentById(node))
    this.entities = [
      {name: 'Parent', entities: [this.componentService.getComponentById(this.component.parent)]},
      {name: 'Microservices', entities: services},
      {name: 'External Services', entities: externalServices}
    ].filter(group => group.entities.length);
    graphNodes = [
      this.component.getGraphNode(), // Add Product node
      ...services.map(service => service.getGraphNode()), // Add internal Services
      ...externalServices.map(service => service.getGraphNode()) // add services from other domains
    ];
    graphEdges = [...relations.inbound, ...relations.inner, ...relations.outbound].map(rel => ({data: rel}));
    this.renderGraph(graphNodes, graphEdges);
  }

  private serviceView() {
    let product: GraphComponent;
    let domain: GraphComponent;
    let outboundServices: GraphComponent[];
    let inboundServices: GraphComponent[]

    this.openAPIService.getMicroserviceAPI(this.component.id).then(api => this.api = api);
    this.entities = [];
    this.relations = this.relationService.getRelationsByComponent(this.componentId);
    this.repository.getInstancesByAppId(this.componentId).then(instances => this.instances = instances);
    product = this.componentService.getComponentById(this.component.parent);
    domain = this.componentService.getComponentById(product.parent);
    outboundServices = this.relations.caller.map(rel => this.componentService.getComponentById(rel.target));
    inboundServices = this.relations.callee.map(rel => this.componentService.getComponentById(rel.source));

    this.entities = [
      {name: 'Parents', entities: [product, domain]},
      {name: 'Inbound Services', entities: inboundServices},
      {name: 'Outbound Services', entities: outboundServices}
    ].filter(group => group.entities.length);
    this.nodes = [
      this.component.getGraphNode(),
      ...inboundServices.map(service => service.getGraphNode()),
      ...outboundServices.map(service => service.getGraphNode()),
    ];
    this.edges = [
      ...this.relations.caller.map(rel => ({'data': rel})),
      ...this.relations.callee.map(rel => ({'data': rel}))
    ];

    this.renderGraph(this.nodes, this.edges);
  }

  private renderGraph(nodes, edges) {
    console.log(nodes, edges);
    cytoscape.use( dagre );
    this.cy = cytoscape;
    /*
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes: nodes,
        edges: edges
      },
      layout: {
        name: 'dagre',
        rankDir: 'LR'
      },
      style: [{
        selector: 'node',
        style: {
          'label': 'data(title)',
          'width': 'label',
          'font-size': '7px',
          'text-valign': 'center',
          'shape': 'hexagon',
          'padding': '10px'
        }
      }, {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': '#00376f',
          'target-arrow-color': '#00376f',
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
        selector: '.' + ComponentType.Product + ':parent',
        style: {
          'text-valign': 'top',
          'padding': '20px',
          'shape': 'rectangle',
          'text-margin-y': '18px',
          'font-size': 12,
        }
      }, {
        selector: '.' + ComponentType.Product + ':childless',
        style: {
          'text-valign': 'center',
          'padding': '10px',
          'shape': 'rectangle',
          'font-size': 12,
        }
      }, {
        selector: '#' + this.component.id + ':childless',
        style: {
          'background-color': '#005dbc',
          'color': 'white',
        }
      }, {
        selector: '#' + this.component.id + ':parent',
        style: {
          'border-color': '#005dbc',
          'color': '#005dbc',
        }
      }, {
        selector: '.highlight',
        style: {
          'border-color': '#827f0b',
          'border-width': '3px',
          'background-color': '#c5c10f',
        }
      }]
    });
    this.cy.on('tap', 'node', event => this.router.navigate(['/service', event.target.id()]));
    */
  }

  public routeParent() {
    this.router.navigate(this.component.parent ?  ['/service', this.component.parent] : ['/']);
  }

  public exportGraph() {
    window.open(this.cy.png({bg: 'white'}).replace(/^data:image\/[^;]+/, 'data:application/octet-stream'));
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
}
