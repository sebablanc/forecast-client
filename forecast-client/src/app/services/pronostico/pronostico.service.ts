import { Injectable } from '@angular/core';
import { HttpHelperService } from '../http/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class PronosticoService {
  private _urlGetPronosticoByCity = 'pronostico/getWeather';

  constructor(private httpHelperService: HttpHelperService) { }

  async getPronosticoByCiudad(body: any): Promise<any>{
    return this.httpHelperService.get({url: this._urlGetPronosticoByCity, body: body}).then((response)=>{
      return response;
    })
  }
}
