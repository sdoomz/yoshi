import unfetch from 'isomorphic-unfetch';
import {
  FunctionArgs,
  FunctionResult,
  UnpackPromise,
  DSL,
  RequestPayload,
} from 'yoshi-server/types';
import { joinUrls } from './utils';

type Options = {
  baseUrl?: string;
};

export interface HttpClient {
  request<Result extends FunctionResult, Args extends FunctionArgs>({
    method: { fileName, functionName },
    args,
    headers,
  }: {
    method: DSL<Result, Args>;
    args: Args;
    headers?: { [index: string]: string };
  }): Promise<UnpackPromise<Result>>;
}

// https://github.com/developit/unfetch/issues/46
const fetch = unfetch;

export default class implements HttpClient {
  private baseUrl: string;

  constructor({ baseUrl = '/' }: Options = {}) {
    this.baseUrl = baseUrl;
  }

  private getCookie(name: string) {
    if (typeof document !== 'undefined') {
      const parts = `; ${document.cookie}`.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts
          .pop()
          ?.split(';')
          .shift();
      }
    }
  }

  async request<Result extends FunctionResult, Args extends FunctionArgs>({
    method: { fileName, functionName },
    args,
    headers = {},
  }: {
    method: DSL<Result, Args>;
    args: Args;
    headers?: { [index: string]: string };
  }): Promise<UnpackPromise<Result>> {
    const url = joinUrls(this.baseUrl, '/_api_');

    const body: RequestPayload = { fileName, functionName, args };

    const xsrfToken = this.getCookie('XSRF-TOKEN');

    const res = await fetch(url, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken ? { 'x-xsrf-token': xsrfToken } : {}),
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();

      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }

      throw new Error(JSON.stringify(error));
    }

    const result = await res.json();

    return result.payload;
  }
}
