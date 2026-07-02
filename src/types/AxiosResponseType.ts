import type { Metadata } from "./Metadata";

export interface AxiosResponseListType<T> extends Metadata {
  data: T[];
}