import { ID, ConstructorOptions, InterpolationOptions } from './types';
declare class Mustaches {
    apis: any;
    constructor(options: ConstructorOptions);
    interpolate({ source, destination, name, data, resolver, formatters, export: exportType }: InterpolationOptions): Promise<ID>;
    private copyFile;
    private getParent;
    private export;
    private upload;
    private readDoc;
    private updateDoc;
}
export default Mustaches;
