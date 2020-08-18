import { ReactNode } from 'react';

export interface BareProps {
  children?: ReactNode;
  className?: string;
}

export type MessageType = 'success' | 'info' | 'warning' | 'error';
