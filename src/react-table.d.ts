import '@tanstack/react-table';
import { ALLOWED_PERMISSIONS } from './lib/permissions';

declare module '@tanstack/react-table' {
    interface ColumnMeta {
      permissions?: ALLOWED_PERMISSIONS[];
    }
  }
  