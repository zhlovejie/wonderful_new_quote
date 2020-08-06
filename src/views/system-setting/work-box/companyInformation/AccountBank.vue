<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="table-operator" style="text-align: right">
      <template v-if="$auth('accountBank:add')">
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      </template>
      <template v-if="$auth('accountBank:one')">
        <a-button type="primary" icon="download" @click="exportToExcel">导出</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('accountBank:one')">
              <a @click="query(record)">查看详情</a>
            </template>
            <template v-if="$auth('accountBank:edit')">
              <a-divider type="vertical"/>
              <a @click="handleEdit(record)">编辑</a>
            </template>
            <template v-if="$auth('accountBank:del')">
              <a-divider type="vertical"/>
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="editModal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="queryModal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import { getAccountBankList, deleteBank } from '@/api/accountBank'
import { STable } from '@/components'
import Modal from '../modules/AccountModal'
const columns = [
  {
  align: 'center',
  title: '序号',
  key: 'order',
  width: '70px',
  scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '单位名称',
    key: 'unitName',
    dataIndex: 'unitName'
  },
  {
    align: 'center',
    title: '开户行名称',
    dataIndex: 'bankName',
    key: 'bankName'
  },
  {
    align: 'center',
    title: '行号',
    dataIndex: 'bankNum',
    key: 'bankNum'
  }, {
    align: 'center',
    title: '账号',
    dataIndex: 'accountNum',
    key: 'accountNum'
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
]
export default {
  name: 'AccountBank',
  props:{
    toolType:{
      type:String,
      default:'0'
    }
  },
  components: {
    STable,
    Modal
  },
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      queryParam:{},
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getAccountBankList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(error => {
            this.loading = false
            console.error(error)
          })
      }
    }
  },
  created(){
    this.queryParam = Object.assign({},this.queryParam,{toolType:this.toolType})
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.modal.add({toolType:this.toolType})
    },
    // 修改详情
    handleEdit (e) {
      this.$refs.editModal.edit(e)
    },
    // 详情
    query (e) {
      this.$refs.queryModal.query(e)
    },
    // 删除
    del (row) {
      const _this = this
      this.$confirm({ title: '警告',
        content: `真的要删除 ${row.accountNum} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          deleteBank({ 'id': row.id }).then(data => {
            if (data.code == 200) {
              _this.$message.success('删除成功')
              _this.$refs.table.refresh(true)
            } else {
              _this.$message.error(data.msg)
            }
          }).catch(() => {
            // Do something
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    exportToExcel () {
      // excel数据导出
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('@/assets/js/Export2Excel')
        const tHeader = ['单位名称', '纳税人识别号', '地址', '电话', '开户行名称', '行号', '账号']
        const filterVal = ['unitName', 'taxPayer', 'address', 'tel', 'bankName', 'bankNum', 'accountNum']
        const list = this.selectedRows
        if (list.length < 1) {
          this.$message.error('请选择一个导出信息')
          return
        }
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '开户行信息')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    handleEditOk () {
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
    display: inline-block
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
