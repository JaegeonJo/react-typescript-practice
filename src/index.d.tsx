// https://www.typescriptlang.org/ko/docs/handbook/module-resolution.html
declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}
