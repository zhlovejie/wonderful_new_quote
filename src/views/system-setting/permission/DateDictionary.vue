<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="showModal">添加字典</a-button>
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="请选择部门" default-value="0">
            <a-select-option value="0">信息部</a-select-option>
            <a-select-option value="1">研发部</a-select-option>
            <a-select-option value="2">硬件部</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-directory-tree
          class="treewrap"
          multiple
          defaultExpandAll
          @select="onSelect"
          @expand="onExpand"
        >
          <a-tree-node title="董事会" key="0-0" defaultExpandAll="true">
            <a-tree-node title="信息部" key="0-0-0" isLeaf/>
            <a-tree-node title="财务部" key="0-0-1" isLeaf/>
          </a-tree-node>
          <a-tree-node title="董事会 1" key="0-1">
            <a-tree-node title="物流部" key="0-1-0" isLeaf/>
            <a-tree-node title="采购部" key="0-1-1" isLeaf/>
          </a-tree-node>
        </a-directory-tree>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :alert="false"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="states" slot-scope="text, record">
              <a-switch checkedChildren="启用" :defaultChecked="(text === 0) ? true : false" unCheckedChildren="禁用" />
            </div>
            <div slot="action" slot-scope="text, record">
              <a-button type="primary" shape="circle" icon="edit" @click="showModal"></a-button>
            </div>
          </s-table>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal
      title="新增部门"
      v-model="visible"
      @ok="hideModal"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-form
        :form="form"
        @submit="handleSubmit"
      >
        <a-form-item
          label="上级"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select
            v-decorator="[
              'gender',
              {rules: [{ required: true, message: 'Please select your gender!' }]}
            ]"
            placeholder="Select a option and change input text above"
            @change="handleSelectChange"
          >
            <a-select-option value="male">
              male
            </a-select-option>
            <a-select-option value="female">
              female
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'note',
              {rules: [{ required: true, message: 'Please input your note!' }]}
            ]"
          />
        </a-form-item>
        <a-form-item
          label="备注"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-textarea placeholder="Basic usage" :rows="4"/>
        </a-form-item>
        <a-form-item
          label="状态"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-radio-group name="radioGroup" :defaultValue="1">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getDataDictionaryList } from '../../../api/systemSetting'
import { STable } from '@/components'

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
    dataIndex: 'department.departmentName',
    key: 'department.departmentName'
  },
  {
    align: 'center',
    title: '排序',
    dataIndex: 'stationName',
    key: 'stationName'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'level',
    key: 'level'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    // key: 'status'
    key: 'states',
    scopedSlots: { customRender: 'states' }
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

const data = [
  // {
  //   key: '1',
  //   name: 'John Brown',
  //   age: 32,
  //   address: 'New York No. 1 Lake Park',
  //   tags: ['nice', 'developer']
  // }, {
  //   key: '2',
  //   name: 'Jim Green',
  //   age: 42,
  //   address: 'London No. 1 Lake Park',
  //   tags: ['loser']
  // }, {
  //   key: '3',
  //   name: 'Joe Black',
  //   age: 32,
  //   address: 'Sidney No. 1 Lake Park',
  //   tags: ['cool', 'teacher']
  // }
]

export default {
  name: 'PositionManagement',
  components: {
    STable
  },
  data () {
    return {
      data: data,
      columns: columns,
      pagination: {},
      loading: false,
      visible: false,
      formLayout: 'horizontal',
      queryParam: {},
      form: this.$form.createForm(this),
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('DevisionManagement 页面开始加载数据。。。')
        return getDataDictionaryList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      }
    }
  },
  mounted () {
    // this.getList({})
    this.treeList({})
  },
  methods: {
    // 获取部门管理页面列表
    getList (params = {}) {
      params = {
        // results: 10,
        // departmentId: 1,
        current: 1,
        size: 8
        // ...params
      }
      console.log('params:', params)
      this.loading = true
      getDataDictionaryList(params).then((data) => {
        const pagination = { ...this.pagination }
        pagination.total = data.data.total || 200
        this.loading = false
        this.data = data.data.records
        this.pagination = pagination
      }).catch(error => {
        this.loading = false
        console.error(error)
      })
    },

    handleTableChange (pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.getList({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    handleChange (value, key, column, record) {
      console.log(value, key, column)
      record[column.dataIndex] = value
    },
    edit (row) {
      row.editable = true
      // row = Object.assign({}, row)
    },
    // eslint-disable-next-line
      del(row) {
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.no} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    save (row) {
      row.editable = false
    },
    cancel (row) {
      row.editable = false
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    showModal () {
      this.visible = true
    },
    hideModal () {
      this.visible = false
    },
    confirm () {
      this.$confirm({
        title: 'Confirm',
        content: 'Bla bla ...',
        okText: '确认',
        cancelText: '取消'
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
      })
    },

    onSelect (keys) {
      console.log('Trigger Select', keys)
    },
    onExpand () {
      console.log('Trigger Expand')
    },

    getList (params = {}) {
      params = {
        // results: 10,
        current: 1,
        size: 8
        // ...params
      }
      console.log('params:', params)
      this.loading = true
      getDataDictionaryList(params).then((data) => {
        const pagination = { ...this.pagination }
        pagination.total = data.data.total || 200
        this.loading = false
        this.data = data.data.records
        this.pagination = pagination
      }).catch(error => {
        this.loading = false
        console.error(error)
      })
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
