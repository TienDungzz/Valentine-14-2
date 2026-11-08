// Node-only XML adapter for our path-only SVG fixtures and geometry QA.
import { DOMParser as XMLParser } from '@xmldom/xmldom';

export class SVGTestParser extends XMLParser {
  parseFromString(text, type) {
    const doc = super.parseFromString(text, type);
    function addQueries(node) {
      node.querySelectorAll = (selector) => selector.split(',').flatMap((tag) => {
        const name = tag.trim();
        if (!/^[a-zA-Z]+$/.test(name)) throw new Error('Unsupported test SVG selector: ' + name);
        return Array.from(node.getElementsByTagName(name));
      });
      for (const child of Array.from(node.childNodes ?? [])) {
        if (child.nodeType === 1) addQueries(child);
      }
    }
    addQueries(doc);
    return doc;
  }
}
