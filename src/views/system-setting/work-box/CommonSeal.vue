<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="common-seal-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.name" placeholder="根据名称模糊查询"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
        </a-form-item>

        <div class="action-wrapper" style="float:right;">
          <a-form-item>
          <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>
          </a-form-item>
        </div>

      </a-form>
    </div>

    <s-table
      rowKey="id"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="sealUrl" slot-scope="text">
        <img style="height: 70px;lenght:70px" :src="text" />
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="$refs.createModal.edit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.id)" okText="是" cancelText="否">
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <create-seal ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateSeal from './modules/CreateSeal'
import { sealList, delSeal } from '@/api/workBox'

export default {
  name: 'CommonSeal', // 企业公章管理
  components: { // 组件
    STable,
    CreateSeal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '代码',
          dataIndex: 'code'
        },
        {
          title: '图片',
          dataIndex: 'sealUrl',
          scopedSlots: { customRender: 'sealUrl' }
        },
        {
          title: '创建人',
          dataIndex: 'createName'
        },
        {
          title: '创建时间',
          width: '200px',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return sealList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(function (err) {
            console.log(err)
          })
      }
    }
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh()
    },
    confirm (id) { // 确认删除事件
      delSeal({ 'id': id }).then(res => {
        this.$refs.table.refresh()
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>
