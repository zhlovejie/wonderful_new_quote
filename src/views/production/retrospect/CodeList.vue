<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="code-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="代码/产品名称：">
          <a-input style="width:250px;" v-model.trim="queryParam.keyword" placeholder="根据代码名称或产品名称模糊查询"/>
        </a-form-item>
        <template v-if="$auth('code:list')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
          <template v-if="$auth('code:add')">
            <a-button style="margin-left: 8px" type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>
          </template>
          </a-form-item>
        </div>
        <a-form-item>
          <a :href="exportProductCode" target="_blank" class="ant-btn ant-btn-primary">导出产品代码</a>
        <!-- <a-button type="primary" @click="exportHandler" :loading="exportLoading" style="margin-left: 8px">
          导出产品代码
        </a-button> -->
        </a-form-item>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="pcId"
      :columns="columns"
      :data="loadData"
    >
      <span slot="allProcess" slot-scope="text">
        <template v-if="$auth('code:one')">
          <a @click="checkProcess(text)">查看工序</a>
        </template>
      </span>
      <span slot="status" slot-scope="text">
        <span v-if="text == 0">禁用</span>
        <span v-if="text == 1">启用</span>
      </span>
      <div slot="createTime" slot-scope="text,record">
        创建时间：{{record.createTime || '无'}}<br/>
        修改时间：{{record.updateTime || '无'}}
      </div>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('code:edit')">
            <a @click="$refs.createModal.edit(record)">修改</a>
          </template>
          <template v-if="$auth('code:del')">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.pcId)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>

    <create-form ref="createModal" @ok="handleOk" />
    <code-process-view ref="codeprocessview" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/CodeForm'
import CodeProcessView from './modules/CodeProcessView'
import { toCodeList, deleteCode, getProcessByCode ,exportProductCode} from '@/api/production/retrospect'

export default {
  name: 'ProcessList',
  components: { // 组件
    STable,
    CreateForm,
    CodeProcessView
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 6 },
        lg: { span: 6}
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6}
      },
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '产品代码',
          dataIndex: 'codeName',
          width:'120px'
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width:'300px'
        },
        {
          title: '父代码',
          width: '100px',
          dataIndex: 'parentCodeName'
        },
        {
          title: '所有工序',
          dataIndex: 'pcId',
          width: '100px',
          scopedSlots: { customRender: 'allProcess' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '100px',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建人',
          width: '100px',
          dataIndex: 'creater'
        },
        {
          title: '时间',
          width: '200px',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '修改人',
          width: '100px',
          dataIndex: 'updater'
        },
        // {
        //   title: '修改时间',
        //   width: '150px',
        //   dataIndex: 'updateTime'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.$set(parameter, 'token', this.$store.getters.token)
        return toCodeList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 200) {
              return res
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      exportProductCode:exportProductCode()
    }
  },
  methods: {
    checkProcess (pcId) {
      getProcessByCode({ pcId: pcId }).then(res => {
        if (res.code === 200) {
          this.$refs.codeprocessview.show(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    confirm (pcId) { // 确认删除事件
      deleteCode({ 'pcId': pcId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}

</script>
