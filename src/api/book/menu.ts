import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetBokList = '/book',
}

export const getBookList = (params) => {
  return defHttp.get({ url: Api.GetBokList, params });
};
