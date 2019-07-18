import { PhoneBookRecord } from './phonebook-record';

export class PhoneBook {
  public phoneBookName: string;
  public phoneBookRecords: PhoneBookRecord[];

  constructor(phoneBook: PhoneBook) {
    this.phoneBookName = phoneBook.phoneBookName;
    this.phoneBookRecords = phoneBook.phoneBookRecords;
  }
}
