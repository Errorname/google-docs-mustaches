import { Formatters, Placeholder } from './types';
import { GDoc } from './gdocTypes';
import findPlaceholders from './findPlaceholders';
import resolvePlaceholders from './resolvePlaceholders';
import buildUpdates from './buildUpdates';
declare const processPlaceholders: (doc: GDoc, data: any, formatters: Formatters, strict?: boolean | undefined) => Placeholder[];
export default processPlaceholders;
export { findPlaceholders, resolvePlaceholders, buildUpdates };
