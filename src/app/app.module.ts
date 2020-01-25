import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AlertComponent } from './shared/alert/alert.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    StoreModule.forRoot(appReducer)
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent]
})
export class AppModule { }
