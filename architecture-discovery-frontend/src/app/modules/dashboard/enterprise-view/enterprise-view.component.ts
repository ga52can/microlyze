import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enterprise-view',
  templateUrl: './enterprise-view.component.html',
  styleUrls: ['./enterprise-view.component.scss']
})
export class EnterpriseViewComponent implements OnInit {
  public domains = [
    {
      id: 1,
      name: 'Production',
      products: [
        {
          id: 101,
          name: 'Printing'
        },
        {
          id: 102,
          name: ''
        },
        {
          id: 103,
          name: 'Printing'
        }
      ]
    },
    {
      id: 2,
      name: 'Marketing',
      products: [
        {
          id: 201,
          name: ''
        }, {
          id: 202,
          name: 'Printing'
        }, {
          id: 203,
          name: 'Printing'
        }
      ]
    },
    {
      id: 3,
      name: 'Marketing',
      products: []
    }
    ];

  constructor() { }
  ngOnInit() {
  }

}
