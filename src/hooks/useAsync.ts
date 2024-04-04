import { useReducer, useEffect } from 'react';

interface AsyncState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

type Action<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'ERROR'; error: Error };

function reducer<T>(state: AsyncState<T>, action: Action<T>): AsyncState<T> {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unsupported action type`);
  }
}

export function useAsync<T>(
  url: string,
  deps: any[] = [],
  skip = false,
): [AsyncState<T>, () => Promise<void>] {
  const [state, dispatch] = useReducer<React.Reducer<AsyncState<T>, Action<T>>>(
    reducer,
    {
      loading: false,
      data: null,
      error: null,
    },
  );

  const fetchData = async (): Promise<void> => {
    dispatch({ type: 'LOADING' });

    try {
      const apiUrl = process.env.REACT_APP_API_URL ?? '*';
      const response = await fetch(`${apiUrl}${url}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        dispatch({ type: 'SUCCESS', data });
      } else {
        const errorText = await response.text();
        throw new Error(
          `Response is not in JSON format. Response body: ${errorText}`,
        );
      }
    } catch (error: any) {
      dispatch({ type: 'ERROR', error });
    }
  };

  useEffect(() => {
    if (!skip) {
      void fetchData();
    }
  }, deps);

  return [state, fetchData];
}
