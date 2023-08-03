const allUnorderdListPattern = /((?:[\+\*\-]\s+[^\n]*\n*)+)/gm;
const allUnorderdListTemplate = "<ul>\n$1\n</ul>";
const unorderdListItemPattern = /(?:[\+\*\-]\s+([^\n]*)\n*)/gm;
const allOrderedListPattern = /((?:\d+[\.\)]\s+[^\n]*\n*)+)/gm;
const allOrderedListTemplate = "<ol>\n$1\n</ol>";
const orderedListItemPattern = /(?:\d+[\.\)]\s+([^\n]*)\n*)/gm;
const listItemTemplate = "<li>$1</li>";
const allBlockQuotePattern = /((?:^\>+\s([^\n]*)\n*)+)/gim;
const blockQuotePattern = /(?:^\>(\>*\s[^\n]*)\n*)/gim;
const allBlockQuoteTemplate = "<blockquote>\n$1\n</blockquote>";
const headerPatternsAndTemplates: [RegExp, string][] = [
  [/#{6}\s+(.*)/gm, "<h6>$1</h6>"],
  [/#{5}\s+(.*)/gm, "<h5>$1</h5>"],
  [/#{4}\s+(.*)/gm, "<h4>$1</h4>"],
  [/#{3}\s+(.*)/gm, "<h3>$1</h3>"],
  [/#{2}\s+(.*)/gm, "<h2>$1</h2>"],
  [/#{1}\s+(.*)/gm, "<h1>$1</h1>"],
];
const emphasisPatternsAndTemplates: [RegExp, string][] = [
  [/([\_\*]{2})([^\n]+)(?:\1)/gm, "<b>$2</b>"],
  [/([\_\*]{1})([^\n]+)(?:\1)/gm, "<i>$2</i>"],
];
const imagePattern = /[^\n\[]*!\[(.*)\]\s*\({1}([^"\)\(\s]*)\s?"(.*)"\){1}/gim;
const imageTemplate = '<image alt="$1" title="$3" src="$2"/>';
const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/;
const linkTemplate = '<a href="$2" target="_blank">$1</a>';

function processBlockQuotes(input: string) {
  input = input
    .replace(allBlockQuotePattern, allBlockQuoteTemplate)
    .replace(blockQuotePattern, "$1\n");
  return input;
}

function processLinks(input: string) {
  return input.replace(linkPattern, linkTemplate);
}

function processImages(input: string) {
  return input.replace(imagePattern, imageTemplate);
}

function processEmphasis(input: string) {
  for (const [pattern, template] of emphasisPatternsAndTemplates) {
    input = input.replace(pattern, template);
  }
  return input;
}
function processHeaders(input: string) {
  for (const [pattern, template] of headerPatternsAndTemplates) {
    input = input.replace(pattern, template);
  }
  return input;
}

function processUnorderedList(input: string) {
  input = input.replace(allUnorderdListPattern, allUnorderdListTemplate);
  input = input.replace(unorderdListItemPattern, listItemTemplate);
  return input;
}
function processOrderedList(input: string) {
  input = input.replace(allOrderedListPattern, allOrderedListTemplate);
  input = input.replace(orderedListItemPattern, listItemTemplate);
  return input;
}
function processLists(input: string) {
  return processOrderedList(processUnorderedList(input));
}
export default function markdownParser(input: string) {
  input = processEmphasis(input);
  input = processImages(input);
  input = processLinks(input);
  input = processBlockQuotes(input);

  input = processHeaders(input);
  return processLists(input);
}
