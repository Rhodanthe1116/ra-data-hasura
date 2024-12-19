import {
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
  UPDATE_MANY,
  DELETE_MANY,
} from '../helpers/fetchActions';
import { sanitizeResource } from './sanitizeResource';
export const getResponseParser = () => (aorFetchType, resource) => (res) => {
  const response = res.data;
  switch (aorFetchType) {
    case GET_MANY_REFERENCE:
    case GET_LIST:
      let output = {
        data: response.items.map(sanitizeResource),
      };
      if (typeof response.total !== 'undefined') {
        output.total = response.total.aggregate.count;
      } else {
        // TODO: behave smarter and set hasNextPage=false when no more records exist.
        output.pageInfo = {
          hasPreviousPage: true,
          hasNextPage: true,
        };
      }
      return output;
    case GET_MANY:
      return { data: response.items.map(sanitizeResource) };
    case GET_ONE:
      return { data: sanitizeResource(response.returning[0]) };
    case CREATE:
    case DELETE:
      return { data: sanitizeResource(response.data.returning[0]) };
    case UPDATE:
      return { data: sanitizeResource(response[resource.UPDATE.name]) };
    case UPDATE_MANY:
    case DELETE_MANY:
      return { data: response.data.returning.map((x) => x.id) };
    default:
      throw Error(`Expected a proper fetchType, got: ${aorFetchType}`);
  }
};
