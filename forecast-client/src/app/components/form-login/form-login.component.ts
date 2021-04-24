import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {
  @Output() submitClicked: EventEmitter<boolean> = new EventEmitter();
  
  loginForm = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  get usuario() { return this.loginForm.controls.usuario; }
  get password() { return this.loginForm.controls.password; }

  constructor(private localStrSrv: LocalstorageService) { }

  ngOnInit(): void {
  }

  login(){
    this.submitClicked.emit(true);
    if(this.loginForm.valid){
      this.localStrSrv.set('usuario', this.loginForm.value);
    }
  }
}
