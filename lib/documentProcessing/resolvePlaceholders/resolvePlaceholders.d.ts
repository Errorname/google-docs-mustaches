import { Placeholder, Formatters } from '../types';
declare const resolvePlaceholders: (placeholders: Placeholder[], data: Record<string, any>, options?: {
    formatters?: Formatters | undefined;
    strict?: boolean | undefined;
} | undefined) => Placeholder[];
export default resolvePlaceholders;
