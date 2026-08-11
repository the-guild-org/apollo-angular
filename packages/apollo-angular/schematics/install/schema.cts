export interface Schema {
  /** Name of the project to target. */
  project: string;
  /** Url to your GraphQL endpoint */
  endpoint?: string;
  /** Version of GraphQL (17 by default) */
  graphql?: string;
}
