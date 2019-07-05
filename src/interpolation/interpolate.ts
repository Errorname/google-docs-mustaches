import { GDoc, Request } from "./types";
import { Formatters } from "../types";

import dot from "./dot";

const interpolate = async (doc: GDoc, data: any, formatters: Formatters, resolver?: Function): Promise<Request[]> => {
  const placeholders = findPlaceholders(doc);

  return computeUpdates(placeholders, data, formatters, resolver);
};

const findPlaceholders = (doc: GDoc): string[] => {
  const placeholders: string[] = [];

  const processContent = (content: any[]) => {
    content.map(c => {
      if (c.paragraph) {
        c.paragraph.elements.map((e: any) => {
          if (e.textRun) {
            const matches = e.textRun.content.match(/{{([^}]*)}}/gi) || [];
            matches.map((m: any) => placeholders.push(m.slice(2, -2)));
          }
        });
      }

      if (c.table) {
        c.table.tableRows.map((r: any) => {
          r.tableCells.map((c: any) => {
            processContent(c.content);
          });
        });
      }
    });
  };

  if (doc.headers) {
    Object.keys(doc.headers).forEach(key => {
      processContent(doc.headers[key].content);
    });
  }

  if (doc.body) {
    processContent(doc.body.content);
  }

  return placeholders;
};

const availableFormatters: Formatters = {
  lowercase: (s: string) => s.toLowerCase(),
  uppercase: (s: string) => s.toUpperCase()
};

const computeUpdates = async (placeholders: string[], data: any, formatters: Formatters, resolver?: Function): Promise<Request[]> => {
  formatters = { ...availableFormatters, ...formatters };

  const replacements = await Promise.all(placeholders.map(async (placeholder): Promise<[string, string]> => {
    let computed: any;

    try {
      computed = dot(data, placeholder, {formatters});
      if (!computed && resolver) {
        computed = await resolver(placeholder);
      }
    } catch (e) {
      if (resolver) {
        computed = await resolver(placeholder);
      }
    }

      return [placeholder, `${computed}`];
    }
  ));

  return replacements.map(([placeholder, computed]) => ({
    replaceAllText: {
      replaceText: computed,
      containsText: {
        text: `{{${placeholder}}}`,
        matchCase: false
      }
    }
  }));
};

export default interpolate;
