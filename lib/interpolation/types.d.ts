export interface GDoc {
    body: Body;
}
export interface Body {
    content: StructuralElement[];
}
export interface StructuralElement {
    paragraph?: Paragraph;
}
export interface Paragraph {
    elements: ParagraphElement[];
}
export interface ParagraphElement {
    textRun?: TextRun;
}
export interface TextRun {
    content: string;
}
export interface Request {
    replaceAllText?: ReplaceAllTextRequest;
}
export interface ReplaceAllTextRequest {
    replaceText: string;
    containsText: SubstringMatchCriteria;
}
export interface SubstringMatchCriteria {
    text: string;
    matchCase: boolean;
}
