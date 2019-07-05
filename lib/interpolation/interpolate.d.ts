import { GDoc, Request } from "./types";
import { Formatters } from "../types";
declare const interpolate: (doc: GDoc, data: any, formatters: Formatters, resolver?: Function | undefined) => Promise<Request[]>;
export default interpolate;
