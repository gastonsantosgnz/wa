// Define los tipos de mensaje para la aplicación

export interface Message {
  id: string;
  messageId: string;
  customerId: string;
  direction: MessageDirection;
  content: string;
  timestamp: Date;
  status: MessageStatus;
}

export type MessageDirection = 'sent' | 'received';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageInput {
  messageId: string;
  customerId: string;
  direction: MessageDirection;
  content: string;
  timestamp: Date;
  status: MessageStatus;
} 