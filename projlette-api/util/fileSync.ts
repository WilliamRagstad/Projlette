export function readFromLocalFile(path: string) {
  const file = Deno.readFileSync(path);
  const data = new TextDecoder("utf-8").decode(file);
  return JSON.parse(data);
}

// deno-lint-ignore no-explicit-any
export function writeToLocalFile(path: string, data: any) {
  const json = JSON.stringify(data);
  Deno.writeFileSync(path, new TextEncoder().encode(json));
}
