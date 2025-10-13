import { HttpStatusCode } from "../constant/HttpStatus";

export class ApiResponse {
  status: number | 200;
  statusMessage: string;
  data: any;
  message: string[];

  constructor(
    status: number,
    statusMessage: string,
    data: any,
    message: string[]
  ) {
    this.status = status;
    this.statusMessage = statusMessage;
    this.data = data;
    this.message = message;
  }

  static builder() {
    return new ApiResponseBuilder();
  }
}

class ApiResponseBuilder {
  private _status: number | undefined;
  private _statusMessage: string | undefined;
  private _data: any;
  private _message: string[] | undefined;

  status(status: number): this {
    this._status = status;
    this._statusMessage = HttpStatusCode[status];
    return this;
  }

  data(data: any): this {
    this._data = data;
    return this;
  }

  message(message: string[]): this {
    this._message = message;
    return this;
  }

  build(): ApiResponse {
    return new ApiResponse(
      this._status ?? 200,
      this._statusMessage ?? "OK",
      this._data ?? null,
      this._message ?? []
    );
  }
}
