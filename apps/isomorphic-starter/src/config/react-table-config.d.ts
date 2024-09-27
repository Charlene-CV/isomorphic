// react-table-config.d.ts
import {
    UseGlobalFiltersState,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersOptions,
  } from 'react-table';
  
  declare module 'react-table' {
    export interface TableState<D extends object = {}> extends UseGlobalFiltersState<D> {}
  
    export interface TableInstance<D extends object = {}> extends UseGlobalFiltersInstanceProps<D> {}
  
    export interface TableOptions<D extends object = {}> extends UseGlobalFiltersOptions<D> {}
  }
  