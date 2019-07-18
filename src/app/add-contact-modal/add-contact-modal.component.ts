import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss']
})
export class AddContactModalComponent implements OnInit {
  public contactForm: FormGroup;

  public ngOnInit() { }

  public constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.createForm();
  }

  public submitForm() {
    this.activeModal.close(this.contactForm.value);
  }

  private createForm() {
    this.contactForm = this.formBuilder.group({
      personName: '',
      phoneNumber: ''
    });
  }
}
