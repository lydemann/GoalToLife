import { ApolloCache } from '@apollo/client/core';
import { DocumentNode } from 'graphql';

export interface EntityObject {
  id: string;
}

export function createInCache<ReadQueryResponseT>(
  toCreate: EntityObject,
  { readQuery, variables }: { readQuery: DocumentNode; variables?: Object },
  cache: ApolloCache<any>,
  entityName: keyof ReadQueryResponseT
) {
  const existingEntities = cache.readQuery<
    Record<keyof ReadQueryResponseT, EntityObject[]>
  >({
    query: readQuery,
    variables,
  });

  if (toCreate && existingEntities) {
    cache.writeQuery({
      query: readQuery,
      variables,
      data: {
        [entityName]: [...existingEntities[entityName], toCreate],
      },
    });
  }
}

export function removeFromCache<ReadQueryResponseT>(
  toRemove: EntityObject,
  { readQuery, variables }: { readQuery: DocumentNode; variables?: Object },
  cache: ApolloCache<any>,
  entityName: keyof ReadQueryResponseT
) {
  const existingEntities = cache.readQuery<
    Record<keyof ReadQueryResponseT, EntityObject[]>
  >({
    query: readQuery,
    variables,
  });

  if (toRemove && existingEntities) {
    cache.writeQuery({
      query: readQuery,
      variables,
      data: {
        [entityName]: existingEntities[entityName].filter(
          (entity) => entity.id !== toRemove.id
        ),
      },
    });
  }
}
