<template>
  <a-card :bordered="false">
    <div class="table-operator clearfix">
      <template v-if="$auth('dictionary:add')">
        <a-button class="fl-r" type="primary" icon="plus" @click="showModal('add')">新增</a-button>
      </template>
    </div>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-tree
          v-if="treeData.length > 0"
          :defaultExpandAll="false"
          @select="onSelect"
          @expand="onExpand"
          :treeData="treeData"
        >
        </a-tree>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <a-table
            :columns="columns"
            rowKey="id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="action" slot-scope="record">
              <template v-if="$auth('dictionary:edit')">
                <a @click="showModal('edit', record)">修改</a>
                <a-divider type="vertical"/>
              </template>
              <template v-if="$auth('dictionary:del')">
                <a @click="showDeleteConfirm(record)">删除</a>
              </template>
            </div>
          </a-table>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal
      :title="dialogTitle"
      v-model="visible"
      @ok="handleSubmit()"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-form
        :form="currentRecord"
      >
        <a-form-item
          label="上级"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <span>{{ (currentRecord && currentRecord.parent && currentRecord.parent.text)|| '无' }}</span>
        </a-form-item>
        <a-form-item
          label="名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-model="currentRecord.text"
          />
        </a-form-item>
        <a-form-item
          label="备注"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-textarea v-model="currentRecord.remarks" :rows="4"/>
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import {
  getDictionaryList,
  gettreeList,
  DictionaryModify,
  dictionaryAdd,
  DictionaryDelete,
  getDictionaryByText
} from '../../../api/workBox'

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
    title: '名称',
    dataIndex: 'text',
    key: 'text'
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
  name: 'DataDictionary',
  components: {},
  props: {},
  data () {
    return {
      columns: columns,
      data: [],
      pagination: {},
      loading: false,
      visible: false,
      token: this.$store.getters.token,
      remarks: '',
      currentRecord: {},
      action: 'edit',
      dialogTitle: '修改',
      treeData: [],
      selectedTreeData: {}, // 选中的树节点的数据
      parentId: '', // 树父节点id
      text: '', // 名称
      formLayout: 'horizontal',
      form: this.$form.createForm(this)
    }
  },
  computed: {},
  watch: {},
  cerated () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getList()
      gettreeList().then(res => {
        this.treeData = res.data
      })
    },

    // 获取数据字典页面列表
    getList (params = {}) {
      params = {
        parentId: this.parentId || 0
        // current: params.current || 1,
      }
      this.loading = true
      getDictionaryList(params).then((res) => {
        const pagination = { ...this.pagination }
        pagination.total = res.data.total || 0
        this.loading = false
        this.data = res.data
        this.pagination = pagination
      }).catch(error => {
        this.loading = false
        console.error(error)
      })
    },
    // 表格变化，分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.getList({
        results: pagination.pageSize,
        current: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    // 显示新增，修改弹出层
    showModal (action, record) {
      console.log('显示删除', record)
      this.action = action
      if (action === 'edit') {
        this.dialogTitle = '修改'
        this.currentRecord = { ...record, Authorization: this.token }
      } else if (action === 'add') {
        let parentId = ''
        let text = ''
        this.dialogTitle = '新增'
        // 想办法获取左侧选中的树型节点的数据
        if (this.selectedTreeData !== null) {
          parentId = this.selectedTreeData.key
          text = ''
          this.currentRecord = {
            parent: {
              text: this.selectedTreeData.title
            },
            Authorization: this.token,
            remarks: '',
            text: text,
            parentId: this.parentId
          }
        } else {
          text = ''
        }
      }
      this.visible = true
    },
    doEdit () {
      // 取数据
      const { id, Authorization, text, remarks } = this.currentRecord
      // 组装接口需要的数据
      const params = { id, Authorization, text, remarks }
      this.loading = true
      DictionaryModify(params).then((data) => {
        this.visible = false
        this.getList()
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    },
    doAdd () {
      // 取数据
      const { text, Authorization, remarks, parentId } = this.currentRecord
      // 组装接口需要的数据
      const params = { text, parentId, Authorization, remarks }
      this.loading = true
      dictionaryAdd(params).then(() => {
        this.visible = false
        this.init()
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    },
    // 点击确定提交
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (err === true) {
          console.error('表单验证失败：', values)
          return false
        }
        const params = { 'text': this.currentRecord.text.trim() }
        var _this = this
        getDictionaryByText(params).then((res) => {
          if (this.action === 'edit') {
            if (res.data.length > 0 && _this.currentRecord.id !== res.data[0].id && (_this.parentId === 0 || _this.parentId === '')) {
              this.$message.error('名称重复')
              return
            }
            this.doEdit()
          } else if (this.action === 'add') {
            if (res.data.length > 0 && (_this.parentId === 0 || _this.parentId === '')) {
              this.$message.error('名称重复')
              return
            }
            this.doAdd()
          }
        })
      })
    },
    /**
       * 选中树节点触发
       * @param selectedKeys
       * @param selected
       * @param node
       * 参数的解构赋值
       */
    onSelect (selectedKeys, { selected, node }) {
      if (selected === false) {
        this.selectedTreeData = {}
      } else {
        const { title } = node
        this.selectedTreeData = {
          key: selectedKeys[0],
          title
        }
      }
      this.selectedKeys = selectedKeys
      this.parentId = this.selectedKeys[0]
      // 字典-通过父id查找列表
      this.getList()
    },
    onExpand () { // 树展开
      console.log('Trigger Expand')
    },
    // 删除操作
    showDeleteConfirm (record) {
      const self = this
      console.log('点击删除弹出来的时候record', record)
      self.currentRecord = { ...record, Authorization: self.token }
      self.$confirm({
        title: '操作',
        content: '确定要删除吗？',
        //  content: '<div><p>确定要删除吗111</p><p>确定要删除吗222</p></div>',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          const { id, Authorization } = self.currentRecord
          const params = { id: self.currentRecord.id, Authorization }
          console.log('确定要删除的参数', params)
          DictionaryDelete(params).then((data) => {
            console.log('确定要删除', data)
            // self.getList()
            self.init()
          }).catch(error => {
            console.error(error)
          }).finally(() => {
            self.loading = false
          })
          // 这儿需要调取删除按钮
          console.log('删除了')
        },
        onCancel () {
          console.log('取消删除')
        }
      })
    }
  }
}
</script>

<style scoped>
  .fl-r {
    float: right;
  }

  .clearfix:after {
    display: block;
    content: '';
    clear: both;
    visibility: hidden;
    height: 0;
    font-size: 0;
  }

  .clearfix {
    zoom: 1;
  }

  .btn-delete {
    margin-left: 12px;
  }
</style>
