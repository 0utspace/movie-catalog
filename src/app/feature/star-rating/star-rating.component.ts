import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  constructor() {}
  @Input() rating!: any;
  @Input() isReadOnly!: boolean;
  @Output() ratingChange = new EventEmitter<number>();

  onRateChange(newRating: number) {
    this.rating = newRating;
    this.ratingChange.emit(this.rating);
    console.log('New rating value:', newRating);
  }
}
