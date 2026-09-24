export interface TypeTask {
  type: "type";
  content: string;
}

export interface DeleteTask {
  type: "delete";
  count?: number;
}

export interface DelayTask {
  type: "delay";
  timeout: number;
}

export type TypeWriterTaskQueue = (TypeTask | DeleteTask | DelayTask)[];
export type TypeWriterInfinite = boolean;
