import merge from 'lodash/merge';
import buildDataProvider from 'ra-data-graphql';
import {
  GET_ONE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  DELETE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE_MANY,
} from '../helpers/fetchActions';
import { buildVariables as defaultBuildVariables } from '../buildVariables';
import { getResponseParser as defaultGetResponseParser } from '../getResponseParser';
import { buildGqlQuery } from '../buildGqlQuery';
import {
  buildMetaArgs,
  buildArgs,
  buildApolloArgs,
} from '../buildGqlQuery/buildArgs';
import { buildFields } from '../buildGqlQuery/buildFields';
import { buildQueryFactory } from '../buildQuery';
const defaultOptions = {
  introspection: {
    operationNames: {
      [GET_LIST]: (resource) => `${resource.name}`,
      [GET_ONE]: (resource) => `${resource.name}`,
      [GET_MANY]: (resource) => `${resource.name}`,
      [GET_MANY_REFERENCE]: (resource) => `${resource.name}`,
      [CREATE]: (resource) => `insert_${resource.name}`,
      [UPDATE]: (resource) => `update_${resource.name}_by_pk`,
      [UPDATE_MANY]: (resource) => `update_${resource.name}`,
      [DELETE]: (resource) => `delete_${resource.name}`,
      [DELETE_MANY]: (resource) => `delete_${resource.name}`,
    },
  },
};
const buildGqlQueryDefaults = {
  buildFields,
  buildMetaArgs,
  buildArgs,
  buildApolloArgs,
  aggregateFieldName: (resourceName) => `${resourceName}_aggregate`,
};
export const buildCustomDataProvider = (
  options = {},
  buildGqlQueryOverrides = {},
  customBuildVariables = defaultBuildVariables,
  customGetResponseParser = defaultGetResponseParser
) => {
  const buildGqlQueryOptions = {
    ...buildGqlQueryDefaults,
    ...buildGqlQueryOverrides,
  };
  const customBuildGqlQuery = (introspectionResults) =>
    buildGqlQuery(
      introspectionResults,
      buildGqlQueryOptions.buildFields,
      buildGqlQueryOptions.buildMetaArgs,
      buildGqlQueryOptions.buildArgs,
      buildGqlQueryOptions.buildApolloArgs,
      buildGqlQueryOptions.aggregateFieldName
    );
  const buildQuery = buildQueryFactory(
    customBuildVariables,
    customBuildGqlQuery,
    customGetResponseParser
  );
  return buildDataProvider(merge({}, defaultOptions, { buildQuery }, options));
};
