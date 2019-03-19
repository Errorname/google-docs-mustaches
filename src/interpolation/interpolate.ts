import { GDoc, Request } from "./types";
import { Formatters } from "../types";

import dot from "./dot";

const interpolate = (
  doc: GDoc,
  data: any,
  formatters: Formatters
): Request[] => {
  const placeholders = findPlaceholders(doc);
  return computeUpdates(placeholders, data, formatters);
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

  processContent(doc.body.content);

  return placeholders;
};

const availableFormatters: Formatters = {
  lowercase: (s: string) => s.toLowerCase(),
  uppercase: (s: string) => s.toUpperCase()
};

const computeUpdates = (
  placeholders: string[],
  data: any,
  formatters: Formatters
): Request[] => {
  formatters = { ...availableFormatters, ...formatters };

  const replacements = placeholders.map(
    (placeholder): [string, string] => {
      const computed: string = `${dot(data, placeholder, { formatters })}`;
      return [placeholder, computed];
    }
  );

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
