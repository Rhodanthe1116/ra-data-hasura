import { typeAwareKeyValueReducer } from './typeAwareKeyValueReducer';
export const buildCreateVariables =
  (introspectionResults) => (resource, _, params, __) => {
    const reducer = typeAwareKeyValueReducer(
      introspectionResults,
      resource,
      params
    );
    return Object.keys(params.data).reduce(reducer, {});
  };
