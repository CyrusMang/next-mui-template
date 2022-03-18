import { execute } from 'graphql';
import { filter, make, mergeMap, pipe, takeUntil } from 'wonka';
import { Exchange, OperationResult, CombinedError } from 'urql';

const schemaExchange = (schema) => 
() => {
  return ops$ => {
    const fetchResults$ = pipe(
      ops$,
      mergeMap(operation => {
        const { key } = operation;
        const teardown$ = pipe(
          ops$,
          filter(op => op.operationName === 'teardown' && op.key === key)
        );

        return pipe(
          make(i => {
            const {next, complete} = i
            
            Promise.resolve(
              execute({
                schema,
                document: operation.query,
                variableValues: operation.variables
              })
            )
              .then(result => {
                if (result !== undefined) {
                  next({
                    operation,
                    data: result.data,
                    error: Array.isArray(result.errors)
                      ? new CombinedError({
                          graphQLErrors: result.errors,
                          response: result,
                        })
                      : undefined,
                  });
                }

                complete();
              })
              .catch(error => {
                next({
                  operation,
                  error: error,
                });
                complete();
              });

            return () => {};
          }),
          takeUntil(teardown$)
        );
      })
    );

    return fetchResults$;
  };
};

export default schemaExchange;