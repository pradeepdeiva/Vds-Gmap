import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(6)])
  });

  hide: boolean = true;
  isDisabled: boolean = false;
  errorMsg: string = '';



  constructor(private router: Router,private appserive: AppService) { }

  ngOnInit(): void { }

  onSubmit() {
    if (!this.loginForm.valid) {
      // this.errorMsg = 'Failed';
    } else {
      this.errorMsg = '';
      this.appserive.login(this.loginForm.value);
      this.appserive.setLoggedUser(this.loginForm.value);
      this.router.navigate(['/home']);
    }
  }

  logOut(){

  }



  ngOnDestroy(): void {

  }



}
