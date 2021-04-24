import { Injectable } from '@angular/core';
import { HttpHelperService } from '../http/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class CiudadesService {
  private _urlGetCities = 'cities/byCountry';
  private _urlGetLatLongByCiudad = 'cities/longLat';

  constructor(private httpHelperService: HttpHelperService) { }

  async getCiudadesByPais(body: any): Promise<any>{
    return this.httpHelperService.post({url: this._urlGetCities, body: body}).then((response)=>{
      return response;
    })
  }

  async getLatLongByCiudad(body: any): Promise<any>{
    return this.httpHelperService.get({url: this._urlGetLatLongByCiudad, body: body}).then((response)=>{
      return response;
    })
  }

}

export interface ICiudadResponse{
  exito: boolean;
  message: string;
  ciudades: Array<string>;
  length: number
}

