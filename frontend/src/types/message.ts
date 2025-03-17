// src/types.ts
export type Message = {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
}