import { Injectable } from '@angular/core';
import { HttpHelperService } from '../http/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private _urlGetAllCountries = 'countries/all';

  constructor(private httpHelperService: HttpHelperService) { }

  async getAllPaises(): Promise<IPaisResponse>{
    return this.httpHelperService.get({url: this._urlGetAllCountries, body: null}).then((response)=>{
      return response;
    })
  }
}

export interface IPais{
  name: string;
}

export interface IPaisResponse{
  exito: boolean;
  message: string;
  countries: Array<IPais>;
  length: number
}


