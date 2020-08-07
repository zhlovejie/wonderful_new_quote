<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <a-date-picker style="width:300px;" @change="onChange" />
      <!-- <a-select
        style="width:200px;"
        v-model="queryParam.departmentId"
        @change="handleProvinceChange"
        placeholder="请选择部门"
      >
        <a-select-option :value="undefined">请选择部门</a-select-option>
        <a-select-option
          v-for="item in departmentList"
          :key="item.id"
          :value="item.id"
        >{{ item.departmentName }}</a-select-option>
      </a-select>-->
      <a-button style="margin-left:10px;" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
      <template v-if="$auth('role:add')">
        <a-button style="float:right;" type="primary" icon="plus" @click="handleAdd">新增</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <!-- <a-layout-content> -->
      <a-table :columns="columns" :data-source="data">
        <span slot="action" slot-scope="text, record">
          <a>查看</a>
          <a-divider type="vertical" />
          <a>修改</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">下载</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">删除</a>
        </span>
      </a-table>
      <!-- </a-layout-content> -->
    </a-layout>
  </a-card>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'name',
    slots: { title: 'customTitle' },
  },
  {
    title: '台账年月',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '人数',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '公司缴费金额（元）',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '个人缴费金额（元）',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '提交人',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '提交时间',
    dataIndex: 'address',
    key: 'address',
  },

  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]
export default {
  name: 'RoleManagement',
  components: {},
  data() {
    return {
      data,
      columns,
      // openKeys: ['id'],
      // parentId: 0,
      hiddenBoolean: false,

      selectedRowKeys: [],
      selectedRows: [],

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  methods: {
    onChange(date, dateString) {
      console.log(date, dateString)
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}
</style>
