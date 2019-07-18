import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PhoneBookRecord } from '../model/phonebook-record';

@Component({
  selector: 'app-update-record-modal',
  templateUrl: './update-record-modal.component.html',
  styleUrls: ['./update-record-modal.component.scss']
})
export class UpdateRecordModalComponent implements OnInit {
  public recordForm: FormGroup;
  public recordToUpdate: PhoneBookRecord;

  public constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.createForm();
  }

  public submitForm() {
    this.activeModal.close(this.recordForm.value);
  }

  private createForm() {
    this.recordForm = this.formBuilder.group({
      personName: this.recordToUpdate.personName,
      phoneNumber: this.recordToUpdate.phoneNumber
    });
  }
}
