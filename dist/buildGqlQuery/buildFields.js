import { TypeKind } from 'graphql';
import * as gqlTypes from '../graphql-ast-types-browser';
import getFinalType from '../helpers/getFinalType';
export const buildFields = (type) =>
  type.fields.reduce((acc, field) => {
    const type = getFinalType(field.type);
    if (type.kind !== TypeKind.OBJECT && type.kind !== TypeKind.INTERFACE) {
      return [...acc, gqlTypes.field(gqlTypes.name(field.name))];
    }
    return acc;
  }, []);
