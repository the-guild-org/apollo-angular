import { gql as gqlTag, TypedDocumentNode } from "@apollo/client";

const typedGQLTag: <Result, Variables>(
  literals: ReadonlyArray<string> | Readonly<string>,
  ...placeholders: any[]
) => TypedDocumentNode<Result, Variables> = gqlTag;

export const gql = typedGQLTag;
