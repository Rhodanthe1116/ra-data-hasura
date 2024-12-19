import * as gqlTypes from '../graphql-ast-types-browser';
import { OperationTypeNode } from 'graphql';
import {
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  DELETE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE_MANY,
} from '../helpers/fetchActions';
import { buildFields } from './buildFields';
import { buildArgs, buildApolloArgs, buildMetaArgs } from './buildArgs';
export const buildGqlQuery =
  (
    _,
    buildFields,
    buildMetaArgs,
    buildArgs,
    buildApolloArgs,
    aggregateFieldName
  ) =>
  (resource, aorFetchType, queryType, variables) => {
    const { sortField, sortOrder, ...metaVariables } = variables;
    const apolloArgs = buildApolloArgs(queryType, variables);
    const args = buildArgs(queryType, variables);
    const metaArgs = buildMetaArgs(queryType, metaVariables, aorFetchType);
    const fields = buildFields(resource.type, aorFetchType);
    if (
      aorFetchType === GET_LIST ||
      aorFetchType === GET_MANY ||
      aorFetchType === GET_MANY_REFERENCE
    ) {
      let gqlArray = [
        gqlTypes.field(
          gqlTypes.name(queryType.name),
          gqlTypes.name('items'),
          args,
          null,
          gqlTypes.selectionSet(fields)
        ),
      ];
      // Skip aggregate calls when provided aggregateFieldName function returns NO_COUNT.
      // This is useful to avoid expensive count queries.
      if (aggregateFieldName(queryType.name) !== 'NO_COUNT') {
        gqlArray.push(
          gqlTypes.field(
            gqlTypes.name(aggregateFieldName(queryType.name)),
            gqlTypes.name('total'),
            metaArgs,
            null,
            gqlTypes.selectionSet([
              gqlTypes.field(
                gqlTypes.name('aggregate'),
                null,
                null,
                null,
                gqlTypes.selectionSet([gqlTypes.field(gqlTypes.name('count'))])
              ),
            ])
          )
        );
      }
      return gqlTypes.document([
        gqlTypes.operationDefinition(
          OperationTypeNode.QUERY,
          gqlTypes.selectionSet(gqlArray),
          gqlTypes.name(queryType.name),
          apolloArgs
        ),
      ]);
    }
    if (aorFetchType === UPDATE) {
      return gqlTypes.document([
        gqlTypes.operationDefinition(
          OperationTypeNode.MUTATION,
          gqlTypes.selectionSet([
            gqlTypes.field(
              gqlTypes.name(queryType.name),
              null,
              args,
              null,
              gqlTypes.selectionSet(fields)
            ),
          ]),
          gqlTypes.name(queryType.name),
          apolloArgs
        ),
      ]);
    }
    if (
      aorFetchType === CREATE ||
      aorFetchType === UPDATE_MANY ||
      aorFetchType === DELETE ||
      aorFetchType === DELETE_MANY
    ) {
      return gqlTypes.document([
        gqlTypes.operationDefinition(
          OperationTypeNode.MUTATION,
          gqlTypes.selectionSet([
            gqlTypes.field(
              gqlTypes.name(queryType.name),
              gqlTypes.name('data'),
              args,
              null,
              gqlTypes.selectionSet([
                gqlTypes.field(
                  gqlTypes.name('returning'),
                  null,
                  null,
                  null,
                  gqlTypes.selectionSet(fields)
                ),
              ])
            ),
          ]),
          gqlTypes.name(queryType.name),
          apolloArgs
        ),
      ]);
    }
    return gqlTypes.document([
      gqlTypes.operationDefinition(
        OperationTypeNode.QUERY,
        gqlTypes.selectionSet([
          gqlTypes.field(
            gqlTypes.name(queryType.name),
            gqlTypes.name('returning'),
            args,
            null,
            gqlTypes.selectionSet(fields)
          ),
        ]),
        gqlTypes.name(queryType.name),
        apolloArgs
      ),
    ]);
  };
const buildGqlQueryFactory = (introspectionResults) =>
  buildGqlQuery(
    introspectionResults,
    buildFields,
    buildMetaArgs,
    buildArgs,
    buildApolloArgs,
    (resourceName) => `${resourceName}_aggregate`
  );
export default buildGqlQueryFactory;
