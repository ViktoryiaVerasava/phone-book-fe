import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AddContactModalComponent } from './add-contact-modal/add-contact-modal.component';
import { UpdateRecordModalComponent } from './update-record-modal/update-record-modal.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    ContactListComponent,
    AddContactModalComponent,
    UpdateRecordModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
  entryComponents: [
    AddContactModalComponent,
    UpdateRecordModalComponent
  ]
})
export class AppModule { }
