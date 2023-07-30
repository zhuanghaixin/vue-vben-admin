<template>
  <PageWrapper :class="prefixCls" title="图书列表">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="schemas"
        showActionButtonGroup
        @submit="handleSearch"
      />
    </template>

    <div :class="`${prefixCls}__container`">
      <a-list>
        <template v-for="item in list" :key="item.id">
          <a-list-item>
            <template #extra>
              <a
                :href="wrapperCoverImage(item.cover)"
                target="_blank"
              >
                <img
                  :class="`${prefixCls}__cover`"
                  alt="logo"
                  :src="wrapperCoverImage(item.cover)"
                />
              </a>
            </template>
            <a-list-item-meta>
              <template #description>

                <div :class="`${prefixCls}__action`">
                  <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                </div>
              </template>
              <template #title>
                <p :class="`${prefixCls}__title`">
                  {{ item.title }}
                </p>
                <div :class="`${prefixCls}__content`">
                  {{ item.content }}
                </div>
                <div>
                  <template v-for="tag in item.description" :key="tag">
                    <Tag class="mb-2">
                      {{ tag }}
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <a-pagination
        :total="total"
        :show-total="() => `共 ${total} 条数据`"
        :page-size="pageSize"
        v-model:current="current"
        @change="onPageChange"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Tag, List, Pagination } from 'ant-design-vue';
  import { defineComponent, ref, unref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, searchList, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';

  const list = ref();
  const title = ref();
  const author = ref();
  const total = ref(80);
  const current = ref(1);
  const pageSize = ref(20);

  const handleSearch = (e) => {
    console.log(e);
    if (e.name) {
      title.value = e.name;
    } else {
      title.value = null;
    }
    if (e.author) {
      author.value = e.author;
    } else {
      author.value = null;
    }
    const params = {
      title: unref(title),
      author: unref(author),
      page: unref(current),
      pageSize: unref(pageSize),
    };
    handleSearchList(params);
  };

  const handleSearchList = (params = {}) => {
    searchList(params).then(({ data, count }) => {
      list.value = data;
      total.value = count;
    });
  };

  const onPageChange = (page, pagesize) => {
    current.value = page;
    pageSize.value = pagesize;
    const params = {
      title: unref(title),
      author: unref(author),
      page: unref(current),
      pageSize: unref(pageSize),
    };
    handleSearchList(params);
  };

  const wrapperCoverImage = (cover) => {
    if (cover.startsWith('/')) {
      return `https://www.youbaobao.xyz/book/res/img${cover}`;
    } else {
      return `http://localhost:8080/upload/cover/${cover}`;
    }
  };

  export default defineComponent({
    components: {
      Icon,
      Tag,
      BasicForm,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Pagination.name]: Pagination,
    },
    mounted() {
      handleSearchList();
    },
    setup() {
      return {
        prefixCls: 'list-search',
        list,
        actions,
        schemas,
        handleSearch,
        total,
        current,
        pageSize,
        onPageChange,
        wrapperCoverImage,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      padding: 12px;
      background-color: @component-background;
    }

    &__cover {
      width: 115px;
      height: 140px;
    }

    &__title {
      margin-bottom: 0;
      font-size: 18px;
    }

    &__content {
      margin-bottom: 12px;
      color: @text-color-secondary;
    }

    &__action {
      margin-top: 10px;

      &-item {
        display: inline-block;
        padding: 0 16px;
        color: @text-color-secondary;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:nth-child(1),
        &:nth-child(2) {
          border-right: 1px solid @border-color-base;
        }
      }

      &-icon {
        margin-right: 3px;
      }
    }

    &__time {
      color: rgb(0 0 0 / 45%);
    }
  }
</style>
