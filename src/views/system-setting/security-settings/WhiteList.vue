<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="white-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="ip地址">
          <a-input v-model.trim="queryParam.ip1" placeholder="根据ip地址查询"/>
        </a-form-item>
        <a-form-item label="mac地址">
          <a-input v-model.trim="queryParam.mac1" placeholder="根据mac地址查询" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="mac地址">
          <a-input v-model.trim="queryParam.mac1" placeholder="根据mac地址查询" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model.trim="queryParam.trueName" placeholder="根据用户名查询" style="width: 100%"/>
        </a-form-item>

        <template v-if="$auth('whiteList:list')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>

        <template v-if="$auth('whiteList:add')">
          <a-button type="primary" style="float:right" icon="plus" @click="$refs.createModal.add()">新增</a-button>
        </template>
      </a-form>
    </div>

    <s-table
      rowKey="id"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="status" slot-scope="text,record">
        <template v-if="$auth('whiteList:edit')">
          <a-switch checkedChildren="启用" :defaultChecked="(text === 0) ? true : false" unCheckedChildren="禁用" @change="changestatus(text,record)" />
        </template>
        <template v-if="!$auth('whiteList:edit')">
          <span v-if="text === 0">启用</span>
          <span v-if="text === 1">禁用</span>
        </template>
      </span>
      <span slot="validityDate" slot-scope="record">
        {{record.startDate}} ~ {{record.endDate}}
      </span>
      <span slot="action" slot-scope="text,record">
        <template v-if="$auth('whiteList:edit')">
            <a @click="$refs.createModal.edit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="del(record)">删除</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/CreateForm'
import { listPage, modify , del} from '@/api/system/whiteList'

export default {
  name: 'WhiteList',
  components: { // 组件
    STable,
    CreateForm
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      uploading: false,
      // 表头
      columns: [
        {
          title: '用户名',
          align: 'center',
          dataIndex: 'trueName'
        },
        {
          title: 'ip地址1',
          align: 'center',
          dataIndex: 'ip1'
        },
        {
          title: 'ip地址2',
          align: 'center',
          dataIndex: 'ip2'
        },
        {
          title: 'mac地址1',
          align: 'center',
          dataIndex: 'mac1'
        },
        {
          title: 'mac地址2',
          align: 'center',
          dataIndex: 'mac2'
        },
        {
          title: '状态',
          align: 'center',
          width: '100px',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '有效期',
          align: 'center',
          width: '350px',
          scopedSlots: { customRender: 'validityDate' }
        },
        {
          title: '操作时间',
          align: 'center',
          width: '200px',
          dataIndex: 'modifyTime'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return listPage(Object.assign(parameter, this.queryParam))
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
    changestatus (text, record) { // 改变状态
      let status = 0
      if (text === 0) {
        status = 1
      }
      this.$set(record, 'status', status)
      modify(record).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    del(record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除: ${record.trueName} 的白名单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          del ({ 'id': record.id }).then(res => {
            if (res.code == 200) {
              _this.$refs.table.refresh(false)
            } else {
              _this.$message.error(res.msg)
            }
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
