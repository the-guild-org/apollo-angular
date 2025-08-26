import { DocumentNode, print } from 'graphql';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { ApolloTestingController, MatchOperation } from './controller';
import { Operation, TestOperation } from './operation';

/**
 * A testing backend for `Apollo`.
 *
 * `ApolloTestingBackend` works by keeping a list of all open operations.
 * As operations come in, they're added to the list. Users can assert that specific
 * operations were made and then flush them. In the end, a `verify()` method asserts
 * that no unexpected operations were made.
 */
@Injectable()
export class ApolloTestingBackend implements ApolloTestingController {
  /**
   * List of pending operations which have not yet been expected.
   */
  private open: TestOperation[] = [];

  /**
   * Handle an incoming operation by queueing it in the list of open operations.
   */
  public handle(op: Operation): Observable<FetchResult> {
    return new Observable((observer: Observer<any>) => {
      const testOp = new TestOperation(op, observer);
      this.open.push(testOp);
    });
  }

  /**
   * Helper function to search for operations in the list of open operations.
   */
  private _match(match: MatchOperation): TestOperation[] {
    if (typeof match === 'string') {
      return this.open.filter(testOp => testOp.operation.operationName === match);
    } else if (typeof match === 'function') {
      return this.open.filter(testOp => match(testOp.operation));
    } else {
      if (this.isDocumentNode(match)) {
        return this.open.filter(testOp => print(testOp.operation.query) === print(match));
      }

      return this.open.filter(testOp => this.matchOp(match, testOp));
    }
  }

  private matchOp(match: Operation, testOp: TestOperation): boolean {
    const variables = JSON.stringify(match.variables);
    const extensions = JSON.stringify(match.extensions);

    const sameName = this.compare(match.operationName, testOp.operation.operationName);
    const sameVariables = this.compare(variables, testOp.operation.variables);

    const sameQuery = print(testOp.operation.query) === print(match.query);

    const sameExtensions = this.compare(extensions, testOp.operation.extensions);

    return sameName && sameVariables && sameQuery && sameExtensions;
  }

  private compare(expected?: string, value?: Object | string): boolean {
    const received = typeof value === 'string' ? value : JSON.stringify(value);

    return !expected || received === expected;
  }

  /**
   * Search for operations in the list of open operations, and return all that match
   * without asserting anything about the number of matches.
   */
  public match(match: MatchOperation): TestOperation[] {
    const results = this._match(match);

    results.forEach(result => {
      const index = this.open.indexOf(result);
      if (index !== -1) {
        this.open.splice(index, 1);
      }
    });
    return results;
  }

  /**
   * Expect that a single outstanding request matches the given matcher, and return
   * it.
   *
   * operations returned through this API will no longer be in the list of open operations,
   * and thus will not match twice.
   */
  public expectOne(match: MatchOperation, description?: string): TestOperation {
    description = description || this.descriptionFromMatcher(match);
    const matches = this.match(match);
    if (matches.length > 1) {
      throw new Error(
        `Expected one matching operation for criteria "${description}", found ${matches.length} operations.`,
      );
    }
    if (matches.length === 0) {
      throw new Error(`Expected one matching operation for criteria "${description}", found none.`);
    }
    return matches[0];
  }

  /**
   * Expect that no outstanding operations match the given matcher, and throw an error
   * if any do.
   */
  public expectNone(match: MatchOperation, description?: string): void {
    description = description || this.descriptionFromMatcher(match);
    const matches = this.match(match);
    if (matches.length > 0) {
      throw new Error(
        `Expected zero matching operations for criteria "${description}", found ${matches.length}.`,
      );
    }
  }

  /**
   * Validate that there are no outstanding operations.
   */
  public verify(): void {
    const open = this.open;

    if (open.length > 0) {
      // Show the methods and URLs of open operations in the error, for convenience.
      const operations = open.map(testOp => testOp.operation.operationName).join(', ');
      throw new Error(`Expected no open operations, found ${open.length}: ${operations}`);
    }
  }

  private isDocumentNode(docOrOp: DocumentNode | Operation): docOrOp is DocumentNode {
    return !(docOrOp as Operation).operationName;
  }

  private descriptionFromMatcher(matcher: MatchOperation): string {
    if (typeof matcher === 'string') {
      return `Match operationName: ${matcher}`;
    } else if (typeof matcher === 'object') {
      if (this.isDocumentNode(matcher)) {
        return `Match DocumentNode`;
      }

      const name = matcher.operationName || '(any)';
      const variables = JSON.stringify(matcher.variables) || '(any)';

      return `Match operation: ${name}, variables: ${variables}`;
    } else {
      return `Match by function: ${matcher.name}`;
    }
  }
}
