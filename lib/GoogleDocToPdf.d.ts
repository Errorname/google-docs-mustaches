import { ID, GoogleDocToPdfOptions, ToPdfOptions } from './types';
declare class GoogleDocToPdf {
    apis: any;
    constructor(options: GoogleDocToPdfOptions);
    toPdf(source: ID, optDestination?: ID, options?: ToPdfOptions): Promise<ID>;
    private copyFile;
    private getParent;
    private exportPdf;
    private uploadPdf;
    private readDoc;
    private updateDoc;
}
export default GoogleDocToPdf;
