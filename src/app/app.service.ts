import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private userLoggerIn$ = new BehaviorSubject<boolean>(false);

  constructor(private OAuth: OAuthService, private http: HttpClient,private router: Router) {
    this.OAuth.configure(new AuthConfig());
    this.OAuth.setStorage(sessionStorage);
    this.OAuth.tryLogin({});
    if (this.isLoggedIn()) {
      this.userLoggerIn$.next(true);
    }
  }

  getAccessToken() {
    return sessionStorage.getItem('access_token')
  }

  obtainAccessToken() {
    this.OAuth.initImplicitFlow();
  }

  isLoggedIn() {
    if (this.OAuth.getAccessToken() === null) {
      return false;
    }
    return true;
  }

  getIsLoggedIn() {
    return this.userLoggerIn$.asObservable();
  }

  setLoggedUser(data: any) {
    sessionStorage.setItem('user_info', JSON.stringify(data));
    this.userLoggerIn$.next(true);
  }

  getResource(requestUrl: string): Observable<any> {
    return this.http.get(env.reqUrl + requestUrl, {
      headers: new HttpHeaders()
    }).pipe(
      tap(
        success => console.log('success'),
        error => {
          console.log("Error -> ", this.http.get('status'));
          if (error instanceof HttpErrorResponse && error.status === 403) {
            console.log(`Error Status: ${error.status} ${error.statusText}`);
          }
        }
      )
    );
  }

  postResource(requestUrl: string, formData: any): Observable<any> {
    return this.http.post(env.reqUrl + requestUrl, formData)
      .pipe(
        tap(
          success => console.log('success'),
          error => {
            console.log("Error -> ", this.http.get('status'));
            if (error instanceof HttpErrorResponse && error.status === 403) {
              console.log(`Error Status: ${error.status} ${error.statusText}`);
            }
          }
        )
      );
  }




  login(formData: any) {
    console.log(`LoginDetails: -> ${JSON.stringify(formData)}`);
    sessionStorage.setItem('access_token', '123');
  }

  logout() {
    this.OAuth.logOut();
    this.userLoggerIn$.next(false);
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('insertedItems');
    this.router.navigate(['']);
  }

}
