import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user = {
    usuario: null,
    password: null
  }
  
  constructor(private localStrSrv: LocalstorageService) { }

  ngOnInit(): void {
    setInterval(()=>{
      this.user = JSON.parse(this.localStrSrv.get('usuario'));
    }, 1000);
  }

  cerrarSesion(){
    this.localStrSrv.remove('usuario');
    this.user = null;
  }
}
