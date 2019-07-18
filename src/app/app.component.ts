import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription, of, forkJoin } from 'rxjs';
import { concatMap, catchError, tap } from 'rxjs/operators';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContactListComponent } from './contact-list/contact-list.component';
import { saveAs } from 'file-saver';
import { DataService } from './services/data.service';
import { PhoneBookRecord } from './model/phonebook-record';
import { UploadFile } from './model/upload-file';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild(ContactListComponent, { static: true }) contactList: ContactListComponent;
  public phoneBookRecords$: Subscription;
  public isAlertMessageShown: boolean = false;
  public alertMessage: string = '';
  public alertType: string = 'success';
  public file: UploadFile = null;
  public fileInput: HTMLInputElement = <HTMLInputElement> {};
  public isUploadDisabled: boolean = true;

  public constructor(private dataService: DataService) { }

  public ngOnDestroy(): void {
    this.phoneBookRecords$.unsubscribe();
  }

  public closeAlert(): void {
    this.isAlertMessageShown = false;
  }

  public showAlert(message: string, alertType: string = 'success'): void {
    this.isAlertMessageShown = true;
    this.alertMessage = message;
    this.alertType = alertType;

    setTimeout(() => {
      this.isAlertMessageShown = false;
    }, 5000);
  }

  public downloadPhoneBookData(): void {
    this.phoneBookRecords$ = this.dataService.getPhoneBookRecords()
      .subscribe((phoneBookRecords: PhoneBookRecord[]) => {
        if (phoneBookRecords && phoneBookRecords.length) {
          const recordsToSave: string = phoneBookRecords
            .reduce((result: string, record: PhoneBookRecord) => {
              result += `${(result.length ? ',' : '')}${record.personName}:${record.phoneNumber}`;
              return result;
            }, '');
          this.saveToFile(recordsToSave);
          this.showAlert('The PhoneBook has been downloaded');
        }
      });
  }

  public uploadPhoneBookData(): void {
    if (!this.isUploadDisabled) {
      this.onImport(this.file)
        .then((data: string) => {
          if (data) {
            this.synchronizeData(data);
          }

          this.fileInput.value = '';
          this.file = null;
          this.isUploadDisabled = true;
        });
    }
  }

  public onFileInputChange(fileInput: HTMLInputElement): void {
    this.fileInput = fileInput;
    if (fileInput.files && fileInput.files.length > 0) {
      this.file = new UploadFile(fileInput.files[0]);
      this.isUploadDisabled = false;
    }
  }

  public async onImport(file: UploadFile): Promise<string> {
    if (file) {
      const content: ArrayBufferLike = await file.getContents();
      return Promise.resolve(this.convertBufferStreamToString(content));
    }
  }

  private synchronizeData(data: string): void {
    const recordsTokens: string[] = data.split(',');
    const recordsToLoad: string[][] = recordsTokens.map((token: string) => token.split(':'));

    this.dataService.getPhoneBookRecords().subscribe((records: PhoneBookRecord[]) => {
      const itemsToCreate: Observable<PhoneBookRecord>[] = [];
      const itemsToUpdate: Observable<PhoneBookRecord>[] = [];
      const findSourceRecord: Function = (collection: PhoneBookRecord[], item: PhoneBookRecord) => collection
        .find((record: PhoneBookRecord) => {
          return record.personName === item.personName || record.phoneNumber === item.phoneNumber;
        });

      recordsToLoad.forEach((record: string[]) => {
        if (record[0] && record[1]) {
          const newItem: PhoneBookRecord = new PhoneBookRecord({ personName: record[0].trim(), phoneNumber: record[1].trim() });
          const srcRecord: PhoneBookRecord = findSourceRecord(records, newItem);
          if (srcRecord) {
            const safeRecordToUpdate: PhoneBookRecord = new PhoneBookRecord({
              id: srcRecord.id,
              personName: newItem.personName,
              phoneNumber: newItem.phoneNumber
            });
            itemsToUpdate.push(this.dataService.updatePhoneBookRecord(safeRecordToUpdate));
          } else {
            itemsToCreate.push(this.dataService.createPhoneBookRecord(newItem));
          }
        }
      });

      forkJoin(
        this.mapToObservablesChain(itemsToUpdate),
        this.mapToObservablesChain(itemsToCreate)
      ).pipe(
        tap(() => {
          this.showAlert('The PhoneBook data has been synchronized');
        }),
        catchError((error: Error) => {
          this.showAlert(`An error has occurred while synchronizing the data: '${error.message}'`, 'danger');
          return of(null);
        })).subscribe(() => {
          this.contactList.loadPhoneBookRecords();
        });
    });
  }

  private convertBufferStreamToString(buffer: ArrayBufferLike): string {
    const bufferPart = 10000;
    const array: Uint8Array = new Uint8Array(buffer.slice(0, bufferPart));
    const str: string = String.fromCharCode.apply(String, array);
    return str;
  }

  private saveToFile(value: any): void {
    const blob: Blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const fileName: string = `phone-book.exported.txt`;
    saveAs(blob, fileName);
  }

  private mapToObservablesChain(requests$: Array<Observable<any>>): Observable<any> {
    const requestsClone$: Array<Observable<any>> = requests$.slice();
    let chain$: Observable<any> = of(undefined);

    if (requests$.length > 0) {
      requestsClone$.push(of(undefined));
      chain$ = requestsClone$.reduce((chain: Observable<any>, request: Observable<any>, idx: number) => {
        return idx === 0 ? chain : chain.pipe(concatMap(() => request));
      }, requests$[0]);
    }

    return chain$;
  }

}
