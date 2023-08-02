const parseingRules = [
  // Header rules
  [/#{6}\s?([^\n]+)/g, "<h6>$1<h6>"],
  [/#{5}\s?([^\n]+)/g, "<h5>$1<h5>"],
  [/#{4}\s?([^\n]+)/g, "<h4>$1<h4>"],
  [/#{3}\s?([^\n]+)/g, "<h3>$1<h3>"],
  [/#{2}\s?([^\n]+)/g, "<h2>$1<h2>"],
  [/#{1}\s?([^\n]+)/g, "<h1>$1<h1>"],

  // empasis text
  [/\*\*\s?([^\n]+)\*\*/g, "<b>$1</b>"],
  [/\*\s?([^\n]+)\*/g, "<i>$1</i>"],
  [/__([^_]+)__/g, "<b>$1</b>"],
  [/_([^_`]+)_/g, "<i>$1</i>"],
  [/([^\n]+\n?)/g, "<p>$1</p>"],

  // Links
  [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'],

  //Lists
  [/([^\n]+)(\+)([^\n]+)/g, "<ul><li>$3</li></ul>"],
  [/([^\n]+)(\*)([^\n]+)/g, "<ul><li>$3</li></ul>"],

  //Image
  [
    /!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,
    '<img src="$2" alt="$1" title="$3" />',
  ],
];
let listType = 0;
const listQueue: string[] = [];
const indentedListQueue: string[] = [];
//Pattern for images
//[alt](url "title")
const imagePattern =
  /[^\n\[]*!\[(.*)\]\s*\({1}([^"\)\(\s]*)\s?"(.*)"\){1}[^\]]*/i;

// Patterns for Lists
const unorderdListPattern = /[\+\*]{1}\s*.*[\n]*/;
const orderedListPattern = /\d+\s*[\.\)]{1}\s*(.*)[\n]*/i;

// Patern for headers
// # ## ### #### ##### ######
const headerPattern = /#{1,6}\s?[^\n]+/;

// Pattern for Links
// [text](linkURL)
const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/;

const processImage = (input: string) => {
  const imagePatterns: [RegExp, string][] = [
    [imagePattern, `<image alt="$1" title="$3" src="$2"/>`],
  ];
  for (const [pattern, template] of imagePatterns) {
    input = input.replace(pattern, template);
  }
  return input;
};

const processList = (input: string) => {
  const listPatterns: [RegExp, string][] = [
    [/[\+\*]{1}\s*(.*)[\n]*/, "<li>$1</li>"],
    [orderedListPattern, "<li>$1</li>"],
  ];
  for (const [pattern, template] of listPatterns) {
    input = input.replace(pattern, template);
  }
  return input;
};

const processLink = (input: string) => {
  return input.replace(linkPattern, '<a href="$2" target="_blank">$1</a>');
};

const processHeader = (input: string) => {
  const headerPatterns: [RegExp, string][] = [
    [/#{6}\s?([^\n]+)/g, "<h6>$1<h6>"],
    [/#{5}\s?([^\n]+)/g, "<h5>$1<h5>"],
    [/#{4}\s?([^\n]+)/g, "<h4>$1<h4>"],
    [/#{3}\s?([^\n]+)/g, "<h3>$1<h3>"],
    [/#{2}\s?([^\n]+)/g, "<h2>$1<h2>"],
    [/#{1}\s?([^\n]+)/g, "<h1>$1<h1>"],
  ];
  for (const [pattern, template] of headerPatterns) {
    if (pattern.test(input)) return input.replace(pattern, template);
  }
  return input;
};

const processEmphasis = (input: string) => {
  const emphasisPattens: [RegExp, string][] = [
    [/\*\*\s?([^\n]+)\*\*/g, "<b>$1</b>"],
    [/\*\s?([^\n]+)\*/g, "<i>$1</i>"],
    [/__([^_]+)__/g, "<b>$1</b>"],
    [/_([^_`]+)_/g, "<i>$1</i>"],
  ];
  for (const [pattern, template] of emphasisPattens) {
    input = input.replace(pattern, template);
  }
  return input;
};

const listCleanupFunction = (list: string[]) => {
  if (listType !== 0) {
    list.push(listType === 1 ? "</ul>" : "</ol>");
    listType = 0;
  }
};

export default function markdownParser(input: string) {
  const inputSplit = input.split("\n");
  const outputSplit: string[] = [];

  for (let line of inputSplit) {
    console.log("Start ", line);
    //Check for emphasis
    line = processImage(line);
    console.log("after img ", line);

    line = processEmphasis(line);
    console.log("after emp ", line);

    line = processLink(line);
    console.log("after link ", line);

    if (headerPattern.test(line)) {
      listCleanupFunction(outputSplit);
      line = processHeader(line);
    } else if (unorderdListPattern.test(line)) {
      listCleanupFunction(outputSplit);

      line = processList(line);
    } else if (orderedListPattern.test(line)) {
      listCleanupFunction(outputSplit);

      line = processList(line);
    } else {
      listCleanupFunction(outputSplit);

      line = `<p>${line}</p>`;
    }

    outputSplit.push(line);
  }
  listCleanupFunction(outputSplit);

  return outputSplit.join("\n");
}
