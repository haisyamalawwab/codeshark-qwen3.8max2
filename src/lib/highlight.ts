export type Lang = "html" | "css" | "js";

export interface TokChar {
  ch: string;
  cls: string;
}

type Rule = { re: RegExp; cls: string };

const JS_KEYWORDS =
  "(?:const|let|var|function|return|if|else|for|while|new|typeof|true|false|null|undefined|this|of|in)";

const RULES: Record<Lang, Rule[]> = {
  html: [
    { re: /<!--[\s\S]*?-->/y, cls: "tok-com" },
    { re: /"[^"]*"|'[^']*'/y, cls: "tok-str" },
    { re: /<\/?[a-zA-Z][\w-]*/y, cls: "tok-tag" },
    { re: /[a-zA-Z-]+(?=\s*=)/y, cls: "tok-attr" },
    { re: /[<>!=/]/y, cls: "tok-pun" },
    { re: /[a-zA-Z][\w-]*/y, cls: "tok-txt" },
  ],
  css: [
    { re: /\/\*[\s\S]*?\*\//y, cls: "tok-com" },
    { re: /"[^"]*"|'[^']*'/y, cls: "tok-str" },
    { re: /#[0-9a-fA-F]{3,8}\b/y, cls: "tok-num" },
    { re: /-?\d+(\.\d+)?(px|rem|em|%|s|ms|vh|vw|fr|deg)?/y, cls: "tok-num" },
    { re: /[a-zA-Z-]+(?=\s*:)/y, cls: "tok-prop" },
    { re: /[{}();:,>~+]/y, cls: "tok-pun" },
    { re: /[a-zA-Z-][\w-]*/y, cls: "tok-val" },
  ],
  js: [
    { re: /\/\/.*/y, cls: "tok-com" },
    { re: /"[^"]*"|'[^']*'|`[^`]*`/y, cls: "tok-str" },
    { re: new RegExp(JS_KEYWORDS + "(?![\\w$])", "y"), cls: "tok-kw" },
    { re: /[a-zA-Z_$][\w$]*(?=\s*\()/y, cls: "tok-fn" },
    { re: /\d+(\.\d+)?/y, cls: "tok-num" },
    { re: /[a-zA-Z_$][\w$]*/y, cls: "tok-prop" },
    { re: /[{}()[\];,.=+\-*/<>!&|:]/y, cls: "tok-pun" },
  ],
};

const DEFAULT_CLS: Record<Lang, string> = {
  html: "tok-txt",
  css: "tok-sel",
  js: "tok-txt",
};

export function tokenizeLine(line: string, lang: Lang): TokChar[] {
  const rules = RULES[lang];
  const out: TokChar[] = [];
  let pos = 0;
  while (pos < line.length) {
    let matched = false;
    for (const rule of rules) {
      rule.re.lastIndex = pos;
      const m = rule.re.exec(line);
      if (m && m.index === pos && m[0].length > 0) {
        for (const ch of m[0]) out.push({ ch, cls: rule.cls });
        pos += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push({ ch: line[pos], cls: DEFAULT_CLS[lang] });
      pos++;
    }
  }
  return out;
}

export function tokenize(code: string, lang: Lang): TokChar[][] {
  return code.split("\n").map((l) => tokenizeLine(l, lang));
}
