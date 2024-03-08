import {Component, Input, OnInit} from '@angular/core';
import { Notice } from '@app/shared/models/notice/notice.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @Input({required: true}) result: any;

  constructor() { }


  ngOnInit(): void {
    console.log(this.result);
  }



  public imageSrc(id: any) {
    return `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${id}.png`;
  }
}