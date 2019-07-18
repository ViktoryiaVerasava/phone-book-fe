export class PhoneBookRecord {
  public id?: string;
  public personName: string;
  public phoneNumber: string;
  public createdAt?: string;
  public updatedAt?: string;

  constructor(phoneBookRecord: PhoneBookRecord) {
    this.id = phoneBookRecord.id;
    this.personName = phoneBookRecord.personName;
    this.phoneNumber = phoneBookRecord.phoneNumber;
    this.createdAt = phoneBookRecord.createdAt;
    this.updatedAt = phoneBookRecord.updatedAt;
  }
}
