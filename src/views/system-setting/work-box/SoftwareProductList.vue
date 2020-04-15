<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="software-product-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="产品名称">
          <a-select style="width:200px;" v-model.trim="queryParam.name" placeholder="请选择产品名称" default-value="">
            <a-select-option v-for="name in softwareProductNames" :key="name.index" :value="name.id">{{ name.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="$auth('softwareProduct:list')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
            <template v-if="$auth('softwareProduct:add')">
              <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>
            </template>
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
      <span slot="state" slot-scope="text,record">
        <template v-if="$auth('softwareProduct:edit')">
          <a-switch checkedChildren="启用" :defaultChecked="(text === 1) ? true : false" unCheckedChildren="禁用" @change="changestatus(text,record)" />
        </template>
        <template v-if="!$auth('softwareProduct:edit')">
          <span v-if="text === 1">启用</span>
          <span v-if="text === 0">禁用</span>
        </template>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('softwareProduct:one')">
            <a @click="$refs.previewModal.show(record)">查看</a>
          </template>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/CreateSoftwareProduct'
import Preview from './modules/SoftwareProductView'
import { softwareProductList, editSoftwareProduct } from '@/api/workBox'
import { getDictionary } from '@/api/common'

export default {
  name: 'SoftwareProductList',
  components: { // 组件
    STable,
    CreateForm,
    Preview
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      uploading: false,
      // 表头
      columns: [
        {
          title: '产品名称',
          dataIndex: 'nameText'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '状态',
          width: '100px',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '创建人',
          dataIndex: 'createdName'
        },
        {
          title: '创建时间',
          width: '150px',
          dataIndex: 'createdTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      softwareProductNames: [],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return softwareProductList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(function (err) {
            console.log(err)
          })
      }
    }
  },
  created () { // 初始化钩子,获取所有软件产品名称
    getDictionary({ text: '软件产品名称' }).then(res => {
      this.softwareProductNames = res.data
    })
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
      this.$set(record, 'state', status)
      editSoftwareProduct(record).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>
