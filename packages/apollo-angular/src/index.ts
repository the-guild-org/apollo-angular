export type { TypedDocumentNode } from '@apollo/client';
export { provideApollo, provideNamedApollo } from './apollo-module';
export { Apollo, ApolloBase } from './apollo';
export { QueryRef, QueryRefFromDocument } from './query-ref';
export { Query } from './query';
export { Mutation } from './mutation';
export { Subscription } from './subscription';
export { APOLLO_OPTIONS, APOLLO_NAMED_OPTIONS, APOLLO_FLAGS } from './tokens';
export type { Flags, NamedOptions, ResultOf, VariablesOf } from './types';
export { gql } from './gql';

export { MutationOptions, MutationResult, WatchQueryOptions } from './deprecated';
