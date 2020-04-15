<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper"></div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('process:edit')">
              <a @click="handleEdit(record)">编辑</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <approval-modal ref="editModal" @ok="handleEditOk" @close="handleEditOk" />
  </a-card>
</template>

<script>
import { getListByText } from '@/api/workBox'
import { STable } from '@/components'
import ApprovalModal from './modules/ApprovalModal'

export default {
  name: 'ApprovalProcess',
  components: {
    ApprovalModal,
    STable
  },
  data () {
    return {
      openKeys: ['id'],
      parentId: 0,
      hiddenBoolean: false,
      options: [],
      Selected: '',
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          align: 'center',
          title: '节点名称',
          dataIndex: 'text',
          key: 'text'
        },
        {
          align: 'center',
          title: '用户',
          dataIndex: 'userName',
          key: 'userName'
        },
        {
          align: 'center',
          title: '操作人',
          key: 'modifierName',
          dataIndex: 'modifierName'
        },
        {
          align: 'center',
          title: '操作时间',
          key: 'modifyTime',
          dataIndex: 'modifyTime'
        },
        {
          align: 'center',
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getListByText(Object.assign(parameter, { text: '审批节点' })).then(res => {
          console.log(res.data)
          return res
        })
      }
    }
  },

  methods: {
    // 改变select
    handleChange (value) {
      console.log(`selected ${value}`)
    },

    // 新增
    handleAdd (item) {
      this.$refs.modal.add()
    },

    handleCopy (record) {},
    // 修改详情
    handleEdit (e) {
      this.$refs.editModal.edit(e)
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {},
    handleEditOk () {
      this.$refs.table.refresh(true)
    }
  }
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
