import { Component, Input, OnInit } from '@angular/core';
import { ICityFormData } from '../city-form/city-form.component';

export const DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

@Component({
  selector: 'app-current-forecast-card',
  templateUrl: './current-forecast-card.component.html',
  styleUrls: ['./current-forecast-card.component.scss']
})
export class CurrentForecastCardComponent implements OnInit {

  @Input() current: any;
  @Input() city: ICityFormData;

  currentDay: string;
  iconUrl
  constructor() { }

  ngOnInit(): void {
    let today: Date = new Date();
    this.currentDay = DAYS[today.getDay()];
  }

  getIcon(){
    return "http://openweathermap.org/img/w/" + this.current.weather[0].icon + ".png";
  }
}
