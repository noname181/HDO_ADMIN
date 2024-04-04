import { type StateInterface } from 'interfaces/ICommon';
import { hdoInstance } from './hdoInstance';

export const deleteBatchApi = async (
  opts: { url: string; data: any },
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
        .delete(opts.url, {
          data: opts.data,
          headers: { Authorization: accessToken },
        })
        .then((_response) => {
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
