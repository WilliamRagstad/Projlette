export function setProp(challenge, props: Record<string, any>) {
  for (let prop in props) {
    challenge[prop] = props[prop];
  }
  return challenge;
};
