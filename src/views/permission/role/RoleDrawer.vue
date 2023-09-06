<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { getActiveMenu } from '/@/api/sys/menu';
  import {
    addRole,
    addRoleMenu,
    deleteRoleMenuByRoleId,
    editRole,
    getRoleMenu,
  } from '@/api/sys/user';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const roleIdData = ref();

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema(isUpdate),
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const menuList = await getActiveMenu();
          console.log(menuList);
          treeData.value = menuList;
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          const roleId = data.record.id;
          const roleMenuList = (await getRoleMenu({ roleId })) || [];
          console.log(roleMenuList);
          data.record.menu = roleMenuList.map((item) => item.menuId);
          setFieldsValue({
            ...data.record,
          });
          roleIdData.value = data.record.id;
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          console.log(values);
          if (unref(isUpdate)) {
            const roleId = roleIdData.value;
            const res = await editRole({ id: roleId, ...values });
            if (res) {
              message.success('编辑角色成功');
              await deleteRoleMenuByRoleId({ roleId });
              const { menu = [] } = values;
              for (let menuId of menu) {
                await addRoleMenu({ roleId, menuId });
              }
              closeDrawer();
              emit('success');
            } else {
              message.error('编辑角色失败');
            }
          } else {
            const res = await addRole(values);
            if (res) {
              message.success('新增角色成功');
              // 提交角色和菜单的绑定关系
              const { id: roleId } = res;
              const { menu = [] } = values;
              for (let menuId of menu) {
                await addRoleMenu({ roleId, menuId });
              }
              closeDrawer();
              emit('success');
            } else {
              message.error('新增角色失败');
            }
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  }) as any;
</script>
