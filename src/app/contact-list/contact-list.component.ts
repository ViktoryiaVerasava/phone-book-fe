import { Component, Input, OnInit } from '@angular/core';
import { PhoneBookRecord } from '../model/phonebook-record';
import { DataService } from '../services/data.service';
import { NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';
import { UpdateRecordModalComponent } from '../update-record-modal/update-record-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isUndefined } from 'util';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  public phoneBookRecords: PhoneBookRecord[] = [];
  public searchForm: FormGroup;
  public message = '';
  public showMessage = false;
  public alertType = '';

  public constructor(
    private dataService: DataService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private alertConfig: NgbAlertConfig
  ) {
    this.createForm();
  }

  public ngOnInit() {
    this.loadPhoneBookRecords();
  }

  public searchPhoneBookRecords() {
    this.dataService.getPhoneBookRecords().subscribe(
      (phoneBookRecords) => {
        this.phoneBookRecords = phoneBookRecords;
        this.phoneBookRecords = this.phoneBookRecords.filter((record: PhoneBookRecord) => {
          return record.personName.toLowerCase().includes(this.searchForm.value.searchParam.toLowerCase());
        });
      },
      (error) => {
        this.errorMessage(error.error.message);
      });
  }

  public loadPhoneBookRecords() {
    this.dataService.getPhoneBookRecords().subscribe(
      (phoneBookRecords) => this.phoneBookRecords = phoneBookRecords,
      (error) => {
        this.errorMessage(error.error.message);
      });
  }

  public openFormModal() {
    const modalRef = this.modalService.open(AddContactModalComponent);
    modalRef.result.then((result) => {
      this.dataService.createPhoneBookRecord(result).subscribe(
        (data) => {
          this.loadPhoneBookRecords();
          this.successMessage('New Record has been successfully created');
        },
        (error) => {
          this.errorMessage(error.error.message);
        });
    }).catch((error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  public errorMessage(error: string) {
    if (isUndefined(error)) {
      this.message = 'Internal Server Error';
    } else {
      this.message = error;
    }

    this.alertType = 'danger';
    this.alertConfig.dismissible = true;
    this.showMessage = true;

    setTimeout(() => this.showMessage = false, 5000);
  }

  public onUpdateRecord(recordToUpdate: PhoneBookRecord): void {
    const modalRef = this.modalService.open(UpdateRecordModalComponent);
    modalRef.componentInstance.recordToUpdate = recordToUpdate;
    modalRef.result.then((result: PhoneBookRecord) => {
      const safeRecordToUpdate: PhoneBookRecord = new PhoneBookRecord({
        id: recordToUpdate.id,
        personName: result.personName,
        phoneNumber: result.phoneNumber
      });

      this.dataService.updatePhoneBookRecord(safeRecordToUpdate).subscribe(
        (data) => {
          this.loadPhoneBookRecords();
          this.successMessage(
            `The following Record has been successfully updated: '${recordToUpdate.personName}: ${recordToUpdate.phoneNumber}'`
          );
        },
        (error) => {
          this.errorMessage(error.error.message);
        });
    }).catch((error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  public onRemoveRecord(removedRecord: PhoneBookRecord): void {
    this.loadPhoneBookRecords();
    this.successMessage(`The following Record has been successfully removed: '${removedRecord.personName}: ${removedRecord.phoneNumber}'`);
  }

  public successMessage(success: string) {
    this.alertType = 'success';
    this.alertConfig.dismissible = true;
    this.message = success;
    this.showMessage = true;

    setTimeout(() => this.showMessage = false, 5000);
  }

  public closeAlert() {
    this.message = '';
    this.showMessage = false;
  }

  private createForm() {
    this.searchForm = this.formBuilder.group({
      searchParam: '',
    });
  }
}
