import { GDoc, Request } from './types';
import { Formatters } from '../types';
declare const interpolate: (doc: GDoc, data: any, formatters: Formatters) => Request[];
export default interpolate;
