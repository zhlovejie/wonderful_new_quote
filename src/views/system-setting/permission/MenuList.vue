<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="4">
        <div class="menu-tree-list-wrapper" style="width:100%;overflow:auto;box-shadow: 7px 0px 7px -7px #ddd;height: 600px;">
          <a-tree :treeData="orgTree" :defaultExpandAll="true" @select="handleClick"></a-tree>
        </div>
      </a-col>
      <a-col :span="20">
        <div class="table-operator" style="text-align: right">
          <template v-if="$auth('menu:add')">
            <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
          </template>
        </div>
        <s-table
          roleKey="id"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <span slot="type" slot-scope="text">
            <span v-if="text == 1">目录</span>
            <span v-if="text == 2">菜单</span>
            <span v-if="text == 3">按钮</span>
          </span>
          <span slot="deviceType" slot-scope="text">
            <span v-if="text == 1">pc端</span>
            <span v-if="text == 2">APP端</span>
          </span>
          <span slot="states" slot-scope="text, record">
            <template v-if="$auth('menu:edit')">
              <a-switch
                checkedChildren="启用"
                :checked="(text === 1) ? true : false"
                @click="checkStates(text,record)"
                unCheckedChildren="禁用"
              />
            </template>
            <template v-if="!$auth('menu:edit')">
              <span v-if="text === 1">启用</span>
              <span v-if="text === 0">禁用</span>
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('menu:edit')">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="$auth('menu:one')">
              <a @click="() => handleQuery(record)">详情</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="$auth('menu:del')">
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <create-menu ref="createMenu" @ok="handleOk"/>
    <menu-view ref="menuView"/>
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import CreateMenu from './modules/CreateMenu'
import MenuView from './modules/MenuView'
import { deleteRoute, updateRoute, routeTreeList, routeListPage, getById } from '@/api/system/menu'

export default {
  name: 'MenuList',
  components: {
    CreateMenu,
    STable,
    STree,
    MenuView
  },
  data () {
    return {
      parentId: 0, // 父id
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          align: 'center',
          title: '名称',
          dataIndex: 'title'
        },
        {
          align: 'center',
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          align: 'center',
          title: '平台',
          dataIndex: 'deviceType',
          scopedSlots: { customRender: 'deviceType' }
        },
        {
          align: 'center',
          title: '编码',
          dataIndex: 'code'
        },
        {
          align: 'center',
          title: '地址',
          dataIndex: 'path'
        },
        {
          align: 'center',
          title: '状态',
          dataIndex: 'status',
          width: '150px',
          scopedSlots: { customRender: 'states' }
        },
        {
          align: 'center',
          title: '更新时间',
          dataIndex: 'modifyTime'
        },
        {
          align: 'center',
          title: '操作',
          dataIndex: 'id',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return routeListPage(Object.assign(parameter, this.queryParam)).then(res => {
          const records = res.data.records
          if (records != null && records !== undefined && records.lenght > 0) {
            this.parentId = records[0].id
          }
          return res
        })
      },
      orgTree: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    routeTreeList().then(res => {
      this.orgTree = res.data
    })
  },
  methods: {
    handleClick (selectedKeys) { // 点击树结构菜单
      var parentId = 0
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      this.queryParam = {
        parentId: parentId
      }
      this.parentId = parentId
      this.$refs.table.refresh(true)
    },
    handleAdd () {
      this.$refs.createMenu.add(this.parentId)
    },
    handleEdit (record) {
      this.$refs.createMenu.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      this.$nextTick(() => {
        routeTreeList().then(res => {
          this.orgTree = res.data
        })
      })
    },
    handleQuery (record) {
      if (record.parentId === 0) {
        this.$set(record, 'parentTitle', '无')
      } else {
        getById({ id: record.parentId }).then(res => {
          if (res.code === 200) {
            this.$set(record, 'parentTitle', res.data.title)
          }
        })
      }
      this.$refs.menuView.show(record)
    },
    del (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.title} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          deleteRoute({ 'id': row.id }).then(res => {
            if (res.code === 200) {
              _this.$refs.table.refresh(true)
              _this.$nextTick(() => {
                routeTreeList().then(res => {
                  _this.orgTree = res.data
                })
              })
            } else {
              _this.$message.error(res.msg)
            }
          })
        }
      })
    },
    checkStates (text, record) {
      if (text === 0) {
        record.status = 1
      } else if (text === 1) {
        record.status = 0
      }
      updateRoute(record).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh(true)
        } else {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less">
.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
