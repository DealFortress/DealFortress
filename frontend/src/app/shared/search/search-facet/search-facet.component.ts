import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { capitalize } from '@app/shared/helper-functions/helper-functions';

@Component({
  selector: 'app-search-facet',
  templateUrl: './search-facet.component.html',
  styleUrls: ['./search-facet.component.css']
})

export class SearchFacetComponent implements OnInit {

  @Input()
  public checked!: any[];
  @Input()
  public facet: any;
  @Output()
  public change = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  public isChecked(value: any): boolean {
    return this.checked && this.checked.includes(value);
  }

  public getValue(facetItem: { value: { name: any; }; }, type: string) {
    const value =  type === "range" ? facetItem.value.name : facetItem.value;
    
    return capitalize(value);
  }

}