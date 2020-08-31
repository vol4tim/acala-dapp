import { ReactNode } from 'react';

export interface BareProps {
  children?: ReactNode;
  className?: string;
}

export type MessageType = 'success' | 'info' | 'warning' | 'error';

export type Style = 'normal' | 'primary' | 'warning' | 'error';
