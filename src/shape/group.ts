import { Template, template } from "../template";

export interface GroupProps {
  className: string;
}

export function group({ className }: GroupProps): Template {
  return template`<g class=${className}><!--...children--></g>`;
}
