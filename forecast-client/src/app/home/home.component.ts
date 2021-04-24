import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICityFormData } from '../components/city-form/city-form.component';
import { CiudadesService } from '../services/ciudades/ciudades.service';
import { PronosticoService } from '../services/pronostico/pronostico.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentForecast = null;
  dailyForecast = [];
  city: ICityFormData = {
    ciudad: 'Ciudad de Buenos Aires',
    pais: 'Argentina'
  };
  isLoading = false;
  constructor(private ciudadSrv: CiudadesService, private pronosticoSrv: PronosticoService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.searchForecast(this.city);
  }

  async searchForecast(event: ICityFormData){
    this.isLoading = true;
    this.city = event;
    let responseCiudades = await this.ciudadSrv.getLatLongByCiudad({city: event.ciudad});
    if(responseCiudades && responseCiudades.exito){
      let latLong = responseCiudades.latLong;
      let forecastResponse = await this.pronosticoSrv.getPronosticoByCiudad(latLong);
      if(responseCiudades && responseCiudades.exito){
        this.currentForecast = null;
        this.dailyForecast = [];
        this.currentForecast = forecastResponse.pronostico.current;
        for (let index = 0; index < 5; index++) {
          this.dailyForecast.push(forecastResponse.pronostico.daily[index])
        }
        this.isLoading = false;
      } else {
        this.showError(forecastResponse.message);
      }
    } else {
      this.showError(responseCiudades.message);
    }
  }

  showError(message) {
    this.isLoading = false;
    this._snackBar.open(message, null, {
      duration: 1000,
      panelClass: 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
