const allUnorderdListPattern = /((?:[\+\*\-]\s+[^\n]*\n*)+)/gm;
const allUnorderdListTemplate = "<ul>\n$1\n</ul>";
const allUnorderdListTemplateString = "\n$1\n";

const unorderdListItemPattern = /(?:[\+\*\-]\s+([^\n]*)\n*)/gm;
const allOrderedListPattern = /((?:\d+[\.\)]\s+[^\n]*\n*)+)/gm;
const allOrderedListTemplate = "<ol>\n$1\n</ol>";
const allOrderedListTemplateString = "\n$1\n";

const orderedListItemPattern = /(?:\d+[\.\)]\s+([^\n]*)\n*)/gm;
const listItemTemplate = "<li>$1</li>";
const listItemTemplatestring = "\n\t$1\n";

const allBlockQuotePattern = /((?:^\>+\s([^\n]*)\n*)+)/gim;
const blockQuotePattern = /(?:^\>(\>*\s[^\n]*)\n*)/gim;
const allBlockQuoteTemplate = "<blockquote>\n$1\n</blockquote>";
const allBlockQuoteTemplateString = "\n$1\n";
const headerPatternsAndTemplates: [RegExp, string, string][] = [
  [
    /([^\n]+)\n(?=(={1}))\2{3,}\n/gm,
    "<h1 class='blog-display-header blog-display-h1'>$1</h1>",
    "\n$1\n",
  ],
  [
    /([^\n]+)\n(?=(-{1}))\2{3,}\n/gm,
    "<h2 class='blog-display-header blog-display-h2'>$1</h2>",
    "\n$1\n",
  ],
  [
    /#{6}\s+(.*)/gm,
    "<h6 class='blog-display-header blog-display-h6'>$1</h6>",
    "\n$1\n",
  ],
  [
    /#{5}\s+(.*)/gm,
    "<h5 class='blog-display-header blog-display-h5'>$1</h5>",
    "\n$1\n",
  ],
  [
    /#{4}\s+(.*)/gm,
    "<h4 class='blog-display-header blog-display-h4'>$1</h4>",
    "\n$1\n",
  ],
  [
    /#{3}\s+(.*)/gm,
    "<h3 class='blog-display-header blog-display-h3'>$1</h3>",
    "\n$1\n",
  ],
  [
    /#{2}\s+(.*)/gm,
    "<h2 class='blog-display-header blog-display-h2'>$1</h2>",
    "\n$1\n",
  ],
  [
    /#{1}\s+(.*)/gm,
    "<h1 class='blog-display-header blog-display-h1'>$1</h1>",
    "\n$1\n",
  ],
];
const emphasisPatternsAndTemplates: [RegExp, string, string][] = [
  [/([\_\*]{2})([^\n]+)(?:\1)/gm, "<b>$2</b>", "$2"],
  [/([\_\*]{1})([^\n]+)(?:\1)/gm, "<i>$2</i>", "$2"],
];
const codeFencePattern = /(`{2,})([\s\S]*?)(?:\1)/gi;
const codeFenceTemplate =
  "<div class='codefence-container'><code class='codefence-item'>$2</code></div>";
const codeFenceTemplateString = "``\n$2\n``";

const codeLinePattern =
  /^(?!<div><code>)(.*)(`)(.+)(`)(.*\n?)(?!\n?<\/code><\/div>)/gm;
const codeLineTemplate = "$1<code class='code-item'>$3</code>$5";
const codeLineTemplateString = "$1$3$5";

const imagePattern = /[^\n\[]*!\[(.*)\]\s*\({1}([^"\)\(\s]*)\s?"(.*)"\){1}/gm;
const imageTemplate =
  '<image class="blog-display-image" alt="$1" title="$3" src="$2"/>';
const imageTemplateString = '"$1"';

const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/gm;
const linkTemplate = '<a href="$2" target="_blank">$1</a>';
const linkTemplateString = "[ $1 ]";
const horazontalRulePattern = /\n?^(([-=*_])\2{2,})\n+/gm;
const horazontalRuleTemplate = "<hr>";
const horazontalRuleTemplateString = "\n";

const lineBreakPattern = /(\n)/gi;
const lineBreakTemplate = "</br>";
const lineBreakTemplateString = "\n";

function processLineBreaks(input: string, options?: MarkdownParserOptions) {
  return input.replace(
    lineBreakPattern,
    options?.asString ? lineBreakTemplateString : lineBreakTemplate
  );
}

function processHorazontalRules(
  input: string,
  options?: MarkdownParserOptions
) {
  return input.replace(
    horazontalRulePattern,
    options?.asString ? horazontalRuleTemplateString : horazontalRuleTemplate
  );
}

function processCodeBlock(input: string, options?: MarkdownParserOptions) {
  input = input.replace(
    codeFencePattern,
    options?.asString ? codeFenceTemplateString : codeFenceTemplate
  );
  input = input.replace(
    codeLinePattern,
    options?.asString ? codeLineTemplateString : codeLineTemplate
  );
  return input;
}

function processBlockQuotes(input: string, options?: MarkdownParserOptions) {
  input = input
    .replace(
      allBlockQuotePattern,
      options?.asString ? allBlockQuoteTemplateString : allBlockQuoteTemplate
    )
    .replace(blockQuotePattern, "$1\n");
  return input;
}

function processLinks(input: string, options?: MarkdownParserOptions) {
  return input.replace(
    linkPattern,
    options?.asString ? linkTemplateString : linkTemplate
  );
}

function processImages(input: string, options?: MarkdownParserOptions) {
  return input.replace(
    imagePattern,
    options?.asString ? imageTemplateString : imageTemplate
  );
}

function processEmphasis(input: string, options?: MarkdownParserOptions) {
  for (const [
    pattern,
    template,
    templateString,
  ] of emphasisPatternsAndTemplates) {
    input = input.replace(
      pattern,
      options?.asString ? templateString : template
    );
  }
  return input;
}
function processHeaders(input: string, options?: MarkdownParserOptions) {
  for (const [
    pattern,
    template,
    templateString,
  ] of headerPatternsAndTemplates) {
    input = input.replace(
      pattern,
      options?.asString ? templateString : template
    );
  }
  return input;
}

function processUnorderedList(input: string, options?: MarkdownParserOptions) {
  input = input.replace(
    allUnorderdListPattern,
    options?.asString ? allUnorderdListTemplateString : allUnorderdListTemplate
  );
  input = input.replace(
    unorderdListItemPattern,
    options?.asString ? listItemTemplatestring : listItemTemplate
  );
  return input;
}
function processOrderedList(input: string, options?: MarkdownParserOptions) {
  input = input.replace(
    allOrderedListPattern,
    options?.asString ? allOrderedListTemplateString : allOrderedListTemplate
  );
  input = input.replace(
    orderedListItemPattern,
    options?.asString ? listItemTemplatestring : listItemTemplate
  );
  return input;
}
function processLists(input: string, options?: MarkdownParserOptions) {
  return processOrderedList(processUnorderedList(input, options));
}

export interface MarkdownParserOptions {
  asString?: boolean;
}
export default function markdownParserToHTMLString(
  input: string,
  options: MarkdownParserOptions = { asString: false }
) {
  input = processImages(input, options);
  input = processLinks(input, options);
  input = processCodeBlock(input, options);
  input = processBlockQuotes(input, options);
  input = processHeaders(input, options);
  input = processHorazontalRules(input, options);

  input = processEmphasis(input, options);
  input = processLists(input, options);
  return processLineBreaks(input, options);
}
