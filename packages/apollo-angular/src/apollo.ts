import { Observable } from 'rxjs';
import { Inject, Injectable, NgZone, Optional } from '@angular/core';
import type {
  ApolloClientOptions,
  ApolloQueryResult,
  FetchResult,
  ObservableQuery,
  OperationVariables,
  QueryOptions,
  SubscriptionOptions,
  WatchFragmentResult,
} from '@apollo/client/core';
import { ApolloClient } from '@apollo/client/core';
import { QueryRef } from './query-ref';
import { APOLLO_FLAGS, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from './tokens';
import type {
  EmptyObject,
  ExtraSubscriptionOptions,
  Flags,
  MutationOptions,
  MutationResult,
  NamedOptions,
  WatchFragmentOptions,
  WatchQueryOptions,
} from './types';
import { fromLazyPromise, useMutationLoading, wrapWithZone } from './utils';

export class ApolloBase<TCacheShape = any> {
  private useMutationLoading: boolean;

  constructor(
    protected readonly ngZone: NgZone,
    protected readonly flags?: Flags,
    protected _client?: ApolloClient<TCacheShape>,
  ) {
    this.useMutationLoading = flags?.useMutationLoading ?? false;
  }

  public watchQuery<TData, TVariables extends OperationVariables = EmptyObject>(
    options: WatchQueryOptions<TVariables, TData>,
  ): QueryRef<TData, TVariables> {
    return new QueryRef<TData, TVariables>(
      this.ensureClient().watchQuery<TData, TVariables>({
        ...options,
      }) as ObservableQuery<TData, TVariables>,
      this.ngZone,
    );
  }

  public query<T, V extends OperationVariables = EmptyObject>(
    options: QueryOptions<V, T>,
  ): Observable<ApolloQueryResult<T>> {
    return fromLazyPromise<ApolloQueryResult<T>>(() =>
      this.ensureClient().query<T, V>({ ...options }),
    );
  }

  public mutate<T, V extends OperationVariables = EmptyObject>(
    options: MutationOptions<T, V>,
  ): Observable<MutationResult<T>> {
    return useMutationLoading(
      fromLazyPromise(() => this.ensureClient().mutate<T, V>({ ...options })),
      options.useMutationLoading ?? this.useMutationLoading,
    );
  }

  public watchFragment<
    TFragmentData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  >(
    options: WatchFragmentOptions<TFragmentData, TVariables>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<WatchFragmentResult<TFragmentData>> {
    const obs = this.ensureClient().watchFragment<TFragmentData, TVariables>({ ...options });

    return extra && extra.useZone !== true ? obs : wrapWithZone(obs, this.ngZone);
  }

  public subscribe<T, V extends OperationVariables = EmptyObject>(
    options: SubscriptionOptions<V, T>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<FetchResult<T>> {
    const obs = this.ensureClient().subscribe<T, V>({ ...options });

    return extra && extra.useZone !== true ? obs : wrapWithZone(obs, this.ngZone);
  }

  /**
   * Get an instance of ApolloClient
   */
  public get client(): ApolloClient<TCacheShape> {
    return this.ensureClient();
  }

  /**
   * Set a new instance of ApolloClient
   * Remember to clean up the store before setting a new client.
   *
   * @param client ApolloClient instance
   */
  public set client(client: ApolloClient<TCacheShape>) {
    if (this._client) {
      throw new Error('Client has been already defined');
    }

    this._client = client;
  }

  private ensureClient(): ApolloClient<TCacheShape> {
    this.checkInstance();

    return this._client!;
  }

  private checkInstance(): this is { _client: ApolloClient<TCacheShape> } {
    if (this._client) {
      return true;
    } else {
      throw new Error('Client has not been defined yet');
    }
  }
}

@Injectable()
export class Apollo extends ApolloBase<any> {
  private map: Map<string, ApolloBase<any>> = new Map<string, ApolloBase<any>>();

  constructor(
    ngZone: NgZone,
    @Optional()
    @Inject(APOLLO_OPTIONS)
    apolloOptions?: ApolloClientOptions<any>,
    @Inject(APOLLO_NAMED_OPTIONS) @Optional() apolloNamedOptions?: NamedOptions,
    @Inject(APOLLO_FLAGS) @Optional() flags?: Flags,
  ) {
    super(ngZone, flags);

    if (apolloOptions) {
      this.createDefault(apolloOptions);
    }

    if (apolloNamedOptions && typeof apolloNamedOptions === 'object') {
      for (let name in apolloNamedOptions) {
        if (apolloNamedOptions.hasOwnProperty(name)) {
          const options = apolloNamedOptions[name];
          this.create(options, name);
        }
      }
    }
  }

  /**
   * Create an instance of ApolloClient
   * @param options Options required to create ApolloClient
   * @param name client's name
   */
  public create<TCacheShape>(options: ApolloClientOptions<TCacheShape>, name?: string): void {
    if (isNamed(name)) {
      this.createNamed<TCacheShape>(name, options);
    } else {
      this.createDefault<TCacheShape>(options);
    }
  }

  /**
   * Use a default ApolloClient
   */
  public default(): ApolloBase<any> {
    return this;
  }

  /**
   * Use a named ApolloClient
   * @param name client's name
   */
  public use(name: string): ApolloBase<any> {
    if (isNamed(name)) {
      return this.map.get(name)!;
    } else {
      return this.default();
    }
  }

  /**
   * Create a default ApolloClient, same as `apollo.create(options)`
   * @param options ApolloClient's options
   */
  public createDefault<TCacheShape>(options: ApolloClientOptions<TCacheShape>): void {
    if (this._client) {
      throw new Error('Apollo has been already created.');
    }

    this.client = this.ngZone.runOutsideAngular(() => new ApolloClient<TCacheShape>(options));
  }

  /**
   * Create a named ApolloClient, same as `apollo.create(options, name)`
   * @param name client's name
   * @param options ApolloClient's options
   */
  public createNamed<TCacheShape>(name: string, options: ApolloClientOptions<TCacheShape>): void {
    if (this.map.has(name)) {
      throw new Error(`Client ${name} has been already created`);
    }
    this.map.set(
      name,
      new ApolloBase(
        this.ngZone,
        this.flags,
        this.ngZone.runOutsideAngular(() => new ApolloClient<TCacheShape>(options)),
      ),
    );
  }

  /**
   * Remember to clean up the store before removing a client
   * @param name client's name
   */
  public removeClient(name?: string): void {
    if (isNamed(name)) {
      this.map.delete(name);
    } else {
      this._client = undefined;
    }
  }
}

function isNamed(name?: string): name is string {
  return !!name && name !== 'default';
}
