<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.title" placeholder="根据名称模糊查询"/>
        </a-form-item>
        <template v-if="$auth('ProductFunctionIntroduction:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
            <template v-if="$auth('ProductFunctionIntroduction:add')">
              <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('ProductFunctionIntroduction:one')">
              <a @click="$refs.preview.show(record)">预览</a>
            </template>
            <template v-if="$auth('ProductFunctionIntroduction:edit')">
              <a-divider type="vertical"/>
              <a @click="handleEdit(record)">编辑</a>
            </template>
            <template v-if="$auth('ProductFunctionIntroduction:del')">
              <a-divider type="vertical"/>
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
          </span>
        </s-table>
    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="editModal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <preview ref="preview" @ok="handleSaveOk"/>
  </a-card>
</template>

<script>
import { getProductFunctionIntroductionList, delInformation } from '@/api/enterpriseInformation'
import { STable } from '@/components'
import Modal from '../modules/Synopsis'
import Preview from '../modules/SynopsisPreview'

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
    title: '简介',
    key: 'title',
    dataIndex: 'title'
  },
  {
    align: 'center',
    title: '操作人',
    key: 'modifier',
    dataIndex: 'modifier'
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
  }]

export default {
  name: 'ProductFunctionIntroduction',
  components: {
    STable,
    Modal,
    Preview
  },
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        return getProductFunctionIntroductionList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(error => {
            this.loading = false
            console.error(error)
          })
      }
    }
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.modal.add(5)
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
        content: `真的要删除 ${row.title} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          delInformation({ 'id': row.id }).then(data => {
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

<style scoped>

</style>
