import { defaultTemplateProcessor, SVGTemplateResult } from "lit-html";

export interface Template {
  strings: readonly string[];
  values: unknown[];
  children?: Template[];
}

export const CHILDREN_PLACEHOLDER = "<!--...children-->";

export function template(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Template {
  return {
    strings: strings.raw,
    values,
  };
}

export function createTemplateResult(template: Template): SVGTemplateResult {
  return new SVGTemplateResult(
    template.strings as TemplateStringsArray,
    template.values,
    "SVG",
    defaultTemplateProcessor
  );
}

export function injectTemplate(
  parentTpl: Template,
  childTpl: Template
): Template {
  const childrenIndex = getChildIndex(parentTpl);

  if (!childrenIndex) return parentTpl;

  const splitItems = [
    parentTpl.strings[childrenIndex.itemIndex].substr(0, childrenIndex.offset) +
      childTpl.strings[0],
    childTpl.strings[childTpl.strings.length - 1] +
      parentTpl.strings[childrenIndex.itemIndex].substr(
        childrenIndex.offset + CHILDREN_PLACEHOLDER.length
      ),
  ];

  return {
    strings: [
      ...parentTpl.strings.slice(0, childrenIndex.itemIndex),
      splitItems[0],
      ...childTpl.strings.slice(1, childTpl.strings.length - 1),
      splitItems[1],
      ...parentTpl.strings.slice(childrenIndex.itemIndex + 1),
    ],
    values: [
      ...parentTpl.values.slice(0, childrenIndex.itemIndex),
      ...childTpl.values,
      ...parentTpl.values.slice(childrenIndex.itemIndex),
    ],
  };
}

export function concatTemplate(tpls: Template[]): Template {
  const flattedTpls = tpls.map((tpl) => flatTemplate(tpl));

  return flattedTpls.reduce((result, tpl) => {
    const resultLastIndex = result.strings.length - 1;
    const lastItem = result.strings[resultLastIndex] + " " + tpl.strings[0];
    return {
      strings: [
        ...result.strings.slice(0, resultLastIndex),
        lastItem,
        ...tpl.strings.slice(1),
      ],
      values: [...result.values, ...tpl.values],
    };
  });
}

export function cloneTemplate(tpl: Template): Template {
  return {
    strings: [...tpl.strings],
    values: [...tpl.values],
  };
}

function getChildIndex(template: Template) {
  for (let index = template.strings.length - 1; index >= 0; index--) {
    const item = template.strings[index];
    const childrentIndex = item.indexOf(CHILDREN_PLACEHOLDER);
    if (childrentIndex > -1) {
      return {
        itemIndex: index,
        offset: childrentIndex,
      };
    }
  }
  return null;
}

export function flatTemplate(ttree: Template): Template {
  if (ttree.children) {
    const child = concatTemplate(ttree.children);
    return injectTemplate(ttree, child);
  }
  return cloneTemplate(ttree);
}
