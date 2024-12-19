export const typeAwareKeyValueReducer =
  (introspectionResults, resource, params) => (acc, key) => {
    const type = introspectionResults.types.find(
      (t) => t.name === resource.type.name
    );
    let value = params.data[key];
    if (type) {
      const field = type?.fields?.find((t) => t.name === key);
      if (field?.type?.name === 'date' && params.data[key] === '') {
        value = null;
      }
    }
    return resource.type.fields.some((f) => f.name === key)
      ? {
          ...acc,
          [key]: value,
        }
      : acc;
  };
