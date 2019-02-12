import { ID } from './types';
declare class GoogleDocToPdf {
    apis: any;
    constructor(options: {
        token: Function;
    });
    toPdf(source: ID, optDestination?: ID | null, options?: {
        data?: Object;
        name?: string;
    }): Promise<ID>;
    private copyFile;
    private getParent;
    private exportPdf;
    private uploadPdf;
    private readDoc;
    private updateDoc;
}
export default GoogleDocToPdf;
