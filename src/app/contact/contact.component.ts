import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { PhoneBookRecord } from '../model/phonebook-record';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() public phoneBookRecord: PhoneBookRecord;
  @Output() public removeRecord: EventEmitter<PhoneBookRecord> = new EventEmitter();
  @Output() public updateRecord: EventEmitter<PhoneBookRecord> = new EventEmitter();

  public constructor(private dataService: DataService) { }

  public ngOnInit() { }

  public updatePhoneBookRecord(): void {
    this.updateRecord.emit(this.phoneBookRecord);
  }

  public removePhoneBookRecord(): void {
    this.dataService
      .deletePhoneBookRecord(this.phoneBookRecord.id)
      .subscribe(() => {
        this.removeRecord.emit(this.phoneBookRecord);
      });
  }
}
