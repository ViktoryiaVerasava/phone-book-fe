if (!FileReader.prototype.readAsBinaryString) {
  FileReader.prototype.readAsBinaryString = function(file: File): any {
    const onload: Function = this.onload;
    this.onload = (): void => {
      const array: Uint8Array = new Uint8Array(this.result);
      const buffer: string[] = new Array(array.byteLength);

      for (let i = 0; i < array.byteLength; i++) {
        buffer[i] = String.fromCharCode(array[i]);
      }

      const result: string = buffer.join('');

      Object.defineProperty(this, 'result', {
        get: function(): string {
          return result;
        }
      });

      this.onload = onload;
      const event: Event = document.createEvent('Event');
      event.initEvent('onload', false, false);
      this.addEventListener('onload', onload);
      this.dispatchEvent(event);
    };

    this.readAsArrayBuffer(file);
  };
}

export const ExtendedFileReader: typeof FileReader = FileReader;
