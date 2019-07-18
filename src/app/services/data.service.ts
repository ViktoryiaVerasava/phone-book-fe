import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PhoneBook } from '../model/phonebook';
import { PhoneBookRecord } from '../model/phonebook-record';

@Injectable()
export class DataService {
  private readonly url: string = 'http://localhost:3000/api1/phone-book-records';

  public constructor(private http: HttpClient) { }

  public getPhoneBookRecords(): Observable<PhoneBookRecord[]> {
    return this.http.get<PhoneBookRecord[]>(`${this.url}`).pipe(map((data: any[]) => {
      let mappedData: PhoneBookRecord[] = [];

      if (data && data.length) {
        mappedData = data.map((value: any) => new PhoneBookRecord({
          personName: value.personName,
          phoneNumber: value.phoneNumber,
          updatedAt: value.updatedAt,
          createdAt: value.updatedAt,
          id: value._id
        }));
      }

      return mappedData;
    }));
  }

  public getPhoneBookRecord(id: string): Observable<PhoneBookRecord> {
    return this.http.get<PhoneBookRecord>(`${this.url}/${id}`).pipe(map((data: any) => {
      let mappedData: PhoneBookRecord = <PhoneBookRecord> {};

      if (data) {
        mappedData = new PhoneBookRecord({
          personName: data.personName,
          phoneNumber: data.phoneNumber,
          updatedAt: data.updatedAt,
          createdAt: data.updatedAt,
          id: data._id
        });
      }

      return mappedData;
    }));
  }

  public deletePhoneBookRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  public updatePhoneBookRecord(record: PhoneBookRecord): Observable<PhoneBookRecord> {
    return this.http.put<PhoneBookRecord>(`${this.url}/${record.id}`, record);
  }

  public createPhoneBookRecord(phoneBookRecord: PhoneBookRecord): Observable<any> {
    const safeModel: PhoneBookRecord = new PhoneBookRecord(phoneBookRecord);
    return this.http.post<PhoneBookRecord>(`${this.url}`, safeModel);
  }
}
