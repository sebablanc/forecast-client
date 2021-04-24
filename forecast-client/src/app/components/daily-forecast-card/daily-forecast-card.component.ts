import { Component, Input, OnInit } from '@angular/core';
import { DAYS } from '../current-forecast-card/current-forecast-card.component';

@Component({
  selector: 'app-daily-forecast-card',
  templateUrl: './daily-forecast-card.component.html',
  styleUrls: ['./daily-forecast-card.component.scss']
})
export class DailyForecastCardComponent implements OnInit {

  @Input() dailyList;

  days = DAYS;

  constructor() { }

  ngOnInit(): void {
    
  }
  
  ngOnChanges(){
    console.log(this.dailyList);

  }

  getIcon(day){
    return "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
  }

}
