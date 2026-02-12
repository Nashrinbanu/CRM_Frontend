import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ProductComponent } from './product.component'

@NgModule({
  declarations: [ProductComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [ProductComponent]
})
export class AppModule {}
