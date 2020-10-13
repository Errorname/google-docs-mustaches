import { ID, ConstructorOptions, InterpolationOptions, DiscoverOptions, ExportOptions } from './types';
import { Placeholder } from './documentProcessing/types';
import { GDoc } from './documentProcessing/gdocTypes';
declare class Mustaches {
    apis: any;
    constructor(options: ConstructorOptions);
    interpolate({ source, destination, name, data, formatters, strict }: InterpolationOptions): Promise<ID>;
    discover({ source, data, formatters, strict }: DiscoverOptions): Promise<Placeholder[]>;
    export({ file, mimeType, name, destination }: ExportOptions): Promise<ID>;
    readDoc(file: ID): Promise<GDoc>;
    private getParent;
    private copyFile;
    private updateDoc;
    private upload;
}
export default Mustaches;
