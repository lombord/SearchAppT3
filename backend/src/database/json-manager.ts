import fs from "node:fs";

interface JsonDBOptions {
  fileEncoding?: BufferEncoding;
  loadOnCreate?: boolean;
}

export class JsonDBManager<T> {
  public readonly filePath: string;
  public readonly fileEncoding: BufferEncoding = "utf8";
  private loadedJson?: T[];

  public constructor(filePath: string, options?: JsonDBOptions) {
    const { fileEncoding, loadOnCreate = true } = options || {};

    this.filePath = filePath;
    if (fileEncoding) {
      this.fileEncoding = fileEncoding;
    }

    if (loadOnCreate) {
      this.loadJson();
    }
  }

  public get isLoaded(): boolean {
    return !!this.loadedJson;
  }

  private loadJson() {
    try {
      const file = fs.readFileSync(this.filePath, this.fileEncoding);
      this.loadedJson = JSON.parse(file);
    } catch (error) {
      console.log(error);
      this.loadedJson = [];
    }
  }

  private ensureLoaded(): T[] {
    if (!this.isLoaded) {
      this.loadJson();
    }
    return this.loadedJson as T[];
  }

  public getJson(): T[] {
    return this.ensureLoaded();
  }
}
