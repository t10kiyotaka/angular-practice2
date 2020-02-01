import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoginMode = true;
  isLoading = false;
  error = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy() {
    if (this.closeSub) this.closeSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.error = null;
    if (form.invalid) return;
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password)
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      authObs = this.authService.signUp(email, password)
    }
    // this.subscribeAuthObs(authObs);
    form.reset();
  }

  // subscribeAuthObs(authObs: Observable<AuthResponseData>) {
  //   authObs.subscribe(
  //     (response: AuthResponseData) => {
  //       console.log(response);
  //       this.isLoading = false;
  //       this.route.navigate(['/recipes']);
  //     },
  //     errorMessage => {
  //       console.log(errorMessage);
  //       this.error = errorMessage;
  //       this.showErrorAlert(errorMessage);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  handleError() {
    this.error = null;
  }

  // private showErrorAlert(message: string) {
  //   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
  //     AlertComponent
  //   );
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();
  //   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
  //
  //   componentRef.instance.message = message;
  //   this.closeSub = componentRef.instance.close.subscribe(() => {
  //     this.closeSub.unsubscribe();
  //     hostViewContainerRef.clear();
  //   });
  // }

}
