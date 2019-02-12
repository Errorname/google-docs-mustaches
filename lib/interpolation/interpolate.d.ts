import { GDoc, Request } from './types';
declare const interpolate: (doc: GDoc, data: any) => Request[];
export default interpolate;
