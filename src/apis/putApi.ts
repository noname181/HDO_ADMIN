import {
  type UpdateStateInterface,
  type ApiProps,
  type StateInterface,
} from 'interfaces/ICommon';
import { hdoInstance } from './hdoInstance';

export const putApi = async <T>(
  opts: ApiProps<T>,
  setState: (state: StateInterface) => void,
  onError?: (errorData: any) => void,
) => {
  if (!opts.url) {
    setState({
      isLoading: false,
      error: 'API url이 누락되었습니다.',
      isSuccess: false,
    });
  } else {
    setState({ isLoading: true, error: null, isSuccess: false });
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (accessToken) {
      const axios = hdoInstance();
      axios
        .put(opts.url, opts.data, { headers: { Authorization: accessToken } })
        .then(() => {
          setState({ isLoading: false, error: null, isSuccess: true });
        })
        .catch((err) => {
          setState({
            isLoading: false,
            isSuccess: false,
            error: err?.response?.data,
          });
          if (onError) {
            onError(err?.response?.data);
          }
        });
    } else {
      setState({
        isLoading: false,
        isSuccess: false,
        error: 'token이 유효하지 않습니다.',
      });

      window.location.replace('/');
    }
  }
};

export const putApiUpdate = async <T>(
  opts: ApiProps<T>,
  setState: (state: UpdateStateInterface) => void,
  onError?: (errorData: any) => void,
) => {
  if (!opts.url) {
    setState({
      isLoading: false,
      error: 'API url이 누락되었습니다.',
      isSuccess: false,
      data: null,
    });
  } else {
    setState({ isLoading: true, error: null, isSuccess: false, data: null });
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (accessToken) {
      const axios = hdoInstance();
      axios
        .put(opts.url, opts.data, { headers: { Authorization: accessToken } })
        .then((result) => {
          setState({
            isLoading: false,
            error: null,
            isSuccess: true,
            data: result.data,
          });
        })
        .catch((err) => {
          setState({
            isLoading: false,
            isSuccess: false,
            error: err.response.data,
            data: null,
          });
          if (onError) {
            onError(err?.response?.data);
          }
        });
    } else {
      setState({
        isLoading: false,
        isSuccess: false,
        error: 'token이 유효하지 않습니다.',
        data: null,
      });

      window.location.replace('/');
    }
  }
};
