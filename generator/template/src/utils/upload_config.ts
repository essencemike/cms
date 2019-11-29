import { BASE_API } from '@/config';
import { getToken } from '@/utils';

export const uploadConfig = {
  action: `${BASE_API}/resources/upload?client=web`,
  headers: {
    webToken: getToken(),
  },
};
