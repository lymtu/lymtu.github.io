import { useEffect, useRef, useState } from "react";
import type {
  TypeWriterTaskQueue,
  TypeTask,
  DeleteTask,
  DelayTask,
} from "./types";

import style from "./index.module.css";

export function Typewriter() {
  const [content, setContent] = useState<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const typewriterTaskHandle = {
      currentLength: 0,
      typeSpeed: 300,
      deleteSpeed: 100,
      type(task: TypeTask, index: number) {
        const contentArr = task.content.split("");

        const writeOne = () => {
          if (!contentArr.length) {
            this.currentLength += task.content.length;
            this.todo(index + 1);
            return;
          }
          const text = contentArr.shift();
          setContent((prev) => prev + text);
          timeoutRef.current = setTimeout(() => {
            writeOne();
          }, this.typeSpeed);
        };

        writeOne();
      },
      delete(task: DeleteTask, index: number) {
        const count = task.count || this.currentLength;
        let currentLength = this.currentLength;
        const deleteOne = () => {
          if (currentLength <= this.currentLength - count) {
            this.currentLength -= count;
            this.todo(index + 1);
            return;
          }

          setContent((prev) => prev.slice(0, -1));
          currentLength -= 1;
          timeoutRef.current = setTimeout(() => {
            deleteOne();
          }, this.deleteSpeed);
        };

        deleteOne();
      },
      delay(task: DelayTask, index: number) {
        timeoutRef.current = setTimeout(() => {
          this.todo(index + 1);
        }, task.timeout);
      },
      todo(index: number = 0) {
        index = index % queue.length;
        const task = queue[index];
        if (!task) return;
        this[task.type](task as TypeTask & DeleteTask & DelayTask, index);
      },
    };

    timeoutRef.current = setTimeout(() => {
      typewriterTaskHandle.todo();
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <pre className="font-bold text-lg w-60 h-fit whitespace-pre-line">
      {content}
      <span className={"inline-block " + style.typewriter}>|</span>
    </pre>
  );
}

const queue: TypeWriterTaskQueue = [
  { type: `delay`, timeout: 1000 },
  { type: `type`, content: `✌️,这是我的个人博客,` },
  { type: `delay`, timeout: 2000 },
  {
    type: `type`,
    content: `
记录一些杂七杂八的东西,`,
  },
  { type: `delay`, timeout: 1000 },
  {
    type: `type`,
    content: `
比如: 技术分享`,
  },
  { type: `delay`, timeout: 1500 },
  { type: `delete`, count: 4 },
  { type: `type`, content: `心得` },
  { type: `delay`, timeout: 1500 },
  { type: `delete`, count: 2 },
  { type: `delay`, timeout: 1000 },
  { type: `delete`, count: 17 },
  { type: `type`, content: `欢迎您的访问` },
  { type: `delay`, timeout: 5000 },
  { type: `delete` },
  { type: `delay`, timeout: 2000 },
];
