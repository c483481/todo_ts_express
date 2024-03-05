import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

class Purify {
    private readonly sanitize!: DOMPurify.DOMPurifyI;

    constructor() {
        const window = new JSDOM("").window;
        this.sanitize = DOMPurify(window);
    }

    clean = (text: string): string => {
        return this.sanitize.sanitize(text);
    };
}

export const purify = new Purify();
