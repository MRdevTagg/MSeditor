const windowProps = Object.getOwnPropertyNames(window);
const documentProps = Object.getOwnPropertyNames(Document.prototype);
const Arraymethods = Object.getOwnPropertyNames(Array.prototype);

const html_snippets_keys = () => {
  const keys = [
    "!DOCTYPE",
    "a",
    "abbr",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
  ];
  return keys;
};
const css_props_keys = () => {
  //get all css properties key value as string
  const styles = document.body.style;
  const styleKeys = Object.keys(styles);
  // crate array with keys in snakeCase
  const snakeCaseProperties = styleKeys.map(property => toSnakeCase(property));
  // return array with each snakecased css-property-keys 
  return snakeCaseProperties; // muestra todas las propiedades CSS del elemento en snake-case
};
const js_snippets_keys = () => {
  // store all properties and methods from window object and document & array protoypes
  // getting an array per object
  // then store them in a array of arrays
  // then create a new array and push to it all properties and methods names
  // then return the new array

  const Allprops = [windowProps, documentProps, Arraymethods];
  let jskeys = [];
  Allprops.forEach(prop => {
    prop.map(p => jskeys.push(p));
  });
  return jskeys;
};
