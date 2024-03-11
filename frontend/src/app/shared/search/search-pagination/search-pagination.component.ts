import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { getNoticePagination } from '@app/notices/data-access/store/notices.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search-pagination',
  templateUrl: './search-pagination.component.html',
  styleUrls: ['./search-pagination.component.css']
})
export class SearchPaginationComponent {

  @Input({required:true}) public totalPages!: number;
  @Input({required:true}) public pageIndex!: number;

  @Output() public pageChanged = new EventEmitter<PageEvent>();

  pagination = this.store.select(getNoticePagination);

  constructor(private store: Store) {}
  
 }