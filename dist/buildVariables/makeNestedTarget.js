import set from 'lodash/set';
export const makeNestedTarget = (target, id) => {
  // This simple example should make clear what this function does
  // makeNestedTarget("a.b", 42)
  // makeNestedTarget("a#b", 42)
  // => { a: { b: { _eq: 42 } } }
  // makeNestedTarget("a#b@_contains@c#d", id)
  // => { a: { b: { _contains: { c: { d: 42 } } } } }
  // . -> # to make nested filtering support the same separator/standard
  let [path, operation = '_eq', oppath] = target.split('@');
  let value = oppath
    ? set(
        {},
        oppath
          .split('.')
          .join('#') // nested filtering support the same standard
          .split('#'),
        id
      )
    : id;
  return set({}, path.split('.').join('#').split('#'), {
    [operation]: value,
  });
};
