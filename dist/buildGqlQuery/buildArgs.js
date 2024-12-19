import gqlTypes from '../graphql-ast-types-browser';
import {
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
} from '../helpers/fetchActions';
import getArgType from '../helpers/getArgType';
export const buildArgs = (query, variables) => {
  if (query.args.length === 0) {
    return [];
  }
  const validVariables = Object.keys(variables).filter(
    (k) => typeof variables[k] !== 'undefined'
  );
  return query.args
    .filter((a) => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => [
        ...acc,
        gqlTypes.argument(
          gqlTypes.name(arg.name),
          gqlTypes.variable(gqlTypes.name(arg.name))
        ),
      ],
      []
    );
};
export const buildMetaArgs = (query, variables, aorFetchType) => {
  if (query.args.length === 0) {
    return [];
  }
  const validVariables = Object.keys(variables).filter((k) => {
    if (
      aorFetchType === GET_LIST ||
      aorFetchType === GET_MANY ||
      aorFetchType === GET_MANY_REFERENCE
    ) {
      return (
        typeof variables[k] !== 'undefined' && k !== 'limit' && k !== 'offset'
      );
    }
    return typeof variables[k] !== 'undefined';
  });
  return query.args
    .filter((a) => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => [
        ...acc,
        gqlTypes.argument(
          gqlTypes.name(arg.name),
          gqlTypes.variable(gqlTypes.name(arg.name))
        ),
      ],
      []
    );
};
export const buildApolloArgs = (query, variables) => {
  if (query.args.length === 0) {
    return [];
  }
  const validVariables = Object.keys(variables).filter(
    (k) => typeof variables[k] !== 'undefined'
  );
  return query.args
    .filter((a) => validVariables.includes(a.name))
    .reduce((acc, arg) => {
      return [
        ...acc,
        gqlTypes.variableDefinition(
          gqlTypes.variable(gqlTypes.name(arg.name)),
          getArgType(arg)
        ),
      ];
    }, []);
};
