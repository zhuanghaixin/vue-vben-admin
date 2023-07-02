import { FormSchema } from '/@/components/Form/index';
import { getBookList } from '@/api/book/menu';

export const searchList = async () => {
  const result: any[] = [];
  const data = await getBookList({ page: 1, pageSize: 20 });
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    result.push({
      id: item.id,
      title: item.title,
      description: [item.categoryText, item.language],
      content: item.author,
      time: item.publisher,
    });
  }
  console.log(data, result);
  return result;
};

export const actions: any[] = [
  { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '书名',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        // console.log(e);
      },
    },
  },
  {
    field: 'author',
    component: 'Input',
    label: '作者',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        // console.log(e);
      },
    },
  },
];
