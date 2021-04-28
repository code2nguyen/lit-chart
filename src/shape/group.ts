import { Template, template } from "../template";
import { ifDefined } from "lit/directives/if-defined.js";

export interface GroupProps {
  className: string;
  id?: string;
}

export function group({ className, id }: GroupProps): Template {
  return template`<g id=${ifDefined(
    id
  )} class=${className}><!--...children--></g>`;
}
