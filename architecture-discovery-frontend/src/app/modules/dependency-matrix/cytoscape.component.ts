import { Component as ngComponent, OnInit } from "@angular/core";

@ngComponent({
  selector: "cytograph",
  templateUrl: "./cytoscape.component.html"
})
export class CytoscapeComponent implements OnInit {
  title = "CodeSandbox";

  private _graphData: any = {
    nodes: [
      {
        data: {
          id: "j",
          name: "Jerry",
          faveColor: "#6FB1FC",
          faveShape: "triangle"
        }
      },
      {
        data: {
          id: "e",
          name: "Elaine",
          faveColor: "#EDA1ED",
          faveShape: "ellipse"
        }
      },
      {
        data: {
          id: "k",
          name: "Kramer",
          faveColor: "#86B342",
          faveShape: "octagon"
        }
      },
      {
        data: {
          id: "g",
          name: "George",
          faveColor: "#F5A45D",
          faveShape: "rectangle"
        }
      }
    ],
    edges: [
      { data: { source: "j", target: "e", faveColor: "#6FB1FC" } },
      { data: { source: "j", target: "k", faveColor: "#6FB1FC" } },
      { data: { source: "j", target: "g", faveColor: "#6FB1FC" } },

      { data: { source: "e", target: "j", faveColor: "#EDA1ED" } },
      { data: { source: "e", target: "k", faveColor: "#EDA1ED" } },

      { data: { source: "k", target: "j", faveColor: "#86B342" } },
      { data: { source: "k", target: "e", faveColor: "#86B342" } },
      { data: { source: "k", target: "g", faveColor: "#86B342" } },

      { data: { source: "g", target: "j", faveColor: "#F5A45D" } }
    ]
  };

  constructor() {}

  ngOnInit() {}

  get graphData(): any {
    return this._graphData;
  }

  set graphData(value: any) {
    this._graphData = value;
  }
}
