import { Notification } from "./api";

const TYPE_WEIGHTS: Record<string, number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

export function isLowerPriority(a: Notification, b: Notification): boolean {
  const weightA = TYPE_WEIGHTS[a.Type] || 0;
  const weightB = TYPE_WEIGHTS[b.Type] || 0;

  if (weightA !== weightB) {
      return weightA < weightB;
  }
  return new Date(a.Timestamp).getTime() < new Date(b.Timestamp).getTime();
}

export class MinHeap {
  private heap: Notification[];
  private maxSize: number;

  constructor(maxSize: number) {
      this.heap = [];
      this.maxSize = maxSize;
  }

  push(item: Notification) {
      if (this.heap.length < this.maxSize) {
          this.heap.push(item);
          this._bubbleUp(this.heap.length - 1);
      } else if (isLowerPriority(this.heap[0], item)) {
          this.heap[0] = item;
          this._bubbleDown(0);
      }
  }

  getSortedItems(): Notification[] {
      return [...this.heap].sort((a, b) => isLowerPriority(a, b) ? 1 : -1);
  }

  private _bubbleUp(index: number) {
      while (index > 0) {
          const parentIndex = Math.floor((index - 1) / 2);
          if (isLowerPriority(this.heap[parentIndex], this.heap[index])) {
              break;
          }
          [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
          index = parentIndex;
      }
  }

  private _bubbleDown(index: number) {
      const length = this.heap.length;
      while (true) {
          let leftChildIndex = 2 * index + 1;
          let rightChildIndex = 2 * index + 2;
          let smallest = index;

          if (leftChildIndex < length && isLowerPriority(this.heap[leftChildIndex], this.heap[smallest])) {
              smallest = leftChildIndex;
          }
          if (rightChildIndex < length && isLowerPriority(this.heap[rightChildIndex], this.heap[smallest])) {
              smallest = rightChildIndex;
          }
          if (smallest === index) break;

          [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
          index = smallest;
      }
  }
}
