import { ExtendedFileReader } from './extended-file-reader';

export class UploadFile {

  public constructor(public file: File) { }

  public async getContents(): Promise<any> {
    return new Promise(
      (resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void): void => {
        const reader: any = new ExtendedFileReader();
        reader.onload = (e: any): void => {
          resolve(e.target.result);
        };
        reader.onabort = (): void => {
          reject();
        };
        reader.onerror = (): void => {
          reject();
        };
        reader.readAsArrayBuffer(this.file);
      }
    );
  }
}
