/* ============ PARSER MARKDOWN RINGAN (tanpa dependensi) ============
   Mendukung subset yang dipakai dokumen materi:
   # h1-h4, paragraf, **tebal**, *miring*, `kode inline`, list (-, 1.),
   ```blok kode```, > kutipan, --- garis, tabel pipe, dan placeholder
   gambar "%%IMG:<kunci>%%" pada baris sendiri (blok t: "img"). */

export type MdBlock =
  | { t: "h"; level: number; text: string }
  | { t: "p"; html: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "code"; lang: string; code: string }
  | { t: "quote"; html: string }
  | { t: "hr" }
  | { t: "img"; key: string; alt?: string; src?: string }
  | { t: "table"; head: string[]; rows: string[][] };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** inline: escape dulu, lalu pasang tag markdown */
export function mdInline(s: string): string {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, (_m, c) => `<code class="md-code">${c}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="md-inline-img inline-block rounded max-h-48 my-1" referrerpolicy="no-referrer" />'
  );
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return out;
}

export function parseMd(src: string): MdBlock[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;

  const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
  const cells = (l: string) =>
    l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i];

    /* blok kode berpagar ``` */
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++; // lewati penutup
      blocks.push({ t: "code", lang: fence[1] || "", code: buf.join("\n") });
      continue;
    }

    /* heading */
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      blocks.push({ t: "h", level: h[1].length, text: h[2].trim() });
      i++;
      continue;
    }

    /* garis pemisah */
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push({ t: "hr" });
      i++;
      continue;
    }

    /* placeholder gambar: %%IMG:kunci%% (satu per baris) */
    const img = line.match(/^\s*%%IMG:([\w-]+)%%\s*$/);
    if (img) {
      blocks.push({ t: "img", key: img[1], alt: "", src: "" });
      i++;
      continue;
    }

    /* standard markdown image: ![alt](url) */
    const mdImg = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (mdImg) {
      blocks.push({ t: "img", key: mdImg[2], alt: mdImg[1], src: mdImg[2] });
      i++;
      continue;
    }

    /* kutipan (baris beruntun dimulai "> ") */
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]))
        buf.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ t: "quote", html: mdInline(buf.join(" ")) });
      continue;
    }

    /* tabel pipe */
    if (isTableRow(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      blocks.push({ t: "table", head, rows });
      continue;
    }

    /* list tidak berurut */
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      blocks.push({ t: "ul", items: items.map(mdInline) });
      continue;
    }

    /* list berurut */
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      blocks.push({ t: "ol", items: items.map(mdInline) });
      continue;
    }

    /* baris kosong */
    if (!line.trim()) {
      i++;
      continue;
    }

    /* paragraf: kumpulkan sampai batas blok berikutnya */
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>\s?|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,})\s*$/.test(lines[i]) &&
      !isTableRow(lines[i])
    )
      buf.push(lines[i++]);
    blocks.push({ t: "p", html: mdInline(buf.join(" ")) });
  }

  return blocks;
}
