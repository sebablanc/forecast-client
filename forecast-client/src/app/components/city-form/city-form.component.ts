import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CiudadesService } from 'src/app/services/ciudades/ciudades.service';
import { IPais, PaisService } from 'src/app/services/pais/pais.service';

@Component({
  selector: 'app-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.scss']
})
export class CityFormComponent implements OnInit {

  @Output() dataSelected: EventEmitter<ICityFormData> = new EventEmitter();

  totalPaises: Array<IPais> = [];
  filteredPaises: Array<IPais> = [];
  totalCiudades: Array<string> = [];
  filteredCiudades: Array<string> = [];

  cityForm = new FormGroup({
    pais: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required])
  });

  get pais() { return this.cityForm.controls.pais; }
  get ciudad() { return this.cityForm.controls.ciudad; }


  constructor(private paisSrv: PaisService, private ciudadSrv: CiudadesService, private _snackBar: MatSnackBar) { }

  async ngOnInit() {
    await this.getAllPaises();
  }

  async getAllPaises(){
    var paisesResponse = await this.paisSrv.getAllPaises();
    if(paisesResponse && paisesResponse.exito){
      this.totalPaises = this.filteredPaises = paisesResponse.countries;
    } else {
      this.showError(paisesResponse.message);
    }
  }

  async filterPaises(value: string){
    this.filteredPaises = this.totalPaises.filter(pais =>{
      return pais.name.toLowerCase().includes(value.toLowerCase());
    })
  }

  paisChanged(event){
    let value = this.pais.value.trim();
    if(value.length > 0){
      this.filterPaises(value);
    } else{
      this.filteredPaises = this.totalPaises;
    }
  }

  async getAllCities(){
    this.pais.patchValue(this.pais.value.name.trim())
    let value = this.pais.value;
    var ciudadesResponse = await this.ciudadSrv.getCiudadesByPais({pais: value.toLowerCase()});
    if(ciudadesResponse && ciudadesResponse.exito){
      this.totalCiudades = this.filteredCiudades = ciudadesResponse.ciudades.data;
    } else {
      this.showError(ciudadesResponse.message);
    }
  }

  ciudadChange(event){
    let value = this.ciudad.value.trim();
    if(value.length > 0){
      this.filterCiudades(value);
    } else{
      this.filteredCiudades = this.totalCiudades;
    }
  }

  async filterCiudades(value: string){
    this.filteredCiudades = this.totalCiudades.filter(ciudad =>{
      return ciudad.toLowerCase().includes(value.toLowerCase());
    })
  }

  search(){
    if(this.cityForm.valid){
      this.dataSelected.emit(this.cityForm.value);
    } else {
      this.showError('Completá el formulario para hacer la búsqueda.')
    }
  }

  showError(message) {
    this._snackBar.open(message, null, {
      duration: 1000,
      panelClass: 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

export interface ICityFormData {
  pais: string,
  ciudad: string
}