<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="search-wrapper">
      <a-input v-model.trim="queryParam.productName" style="width:200px;" placeholder="根据名称模糊查询"/>
      <a-input v-model.trim="queryParam.productModel" style="width:200px;margin-left:10px;" placeholder="根据产品代码查询" />
      <template v-if="$auth('productPrice:list')">
        <a-button type="primary" style="margin-left:10px;" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left:10px;" @click="() => queryParam = {}">重置</a-button>
      </template>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="serial" slot-scope="text,record,index">
        {{ index + 1 }}
      </span>

      <span slot="costPrice" slot-scope="text">
        <span v-if="$auth('productPrice:add') || $auth('productPrice:eidt')">{{text}}</span>
        <span v-else>***</span>
      </span>

      <span slot="productPic" slot-scope="text">
        <img style="height: 70px;lenght:70px" :src="text"/>
      </span>
      <span slot="status" slot-scope="text, record">
        <template v-if="$auth('productPrice:eidt')">
          <a-switch
            checkedChildren="启用"
            :defaultChecked="(text === 0) ? true : false"
            unCheckedChildren="禁用"
            @change="changestatus(text,record)"/>
        </template>
        <template v-if="!$auth('productPrice:eidt')">
          <span v-if="text === 0">启用</span>
          <span v-if="text === 1">禁用</span>
        </template>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('productPrice:eidt')">
            <a @click="handleEdit(record)" v-if="record.costPrice!=null||record.priceA!=null||record.priceB!=null||record.priceC!=null">修改</a>
          </template>
          <template v-if="$auth('productPrice:add')">
            <a @click="handleEdit(record)" v-if="record.costPrice==null&&record.priceA==null&&record.priceB==null&&record.priceC==null">新增</a>
          </template>
        </template>
      </span>
    </s-table>
    <price-edit ref="priceEdit" @ok="handleOk"/>
    <preview ref="previewModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import priceEdit from './modules/priceEdit'
import Preview from './modules/Preview'
import { getProductList, delProduct, editProduct } from '@/api/workBox'
import { getDictionary } from '@/api/common'

export default {
  name: 'ProductPrice',
  components: { // 组件
    STable,
    priceEdit,
    Preview
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'productName'
        },
        {
          title: '产品代码',
          dataIndex: 'productModel'
        }, {
          title:'区域',
          dataIndex: 'areaName'
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          scopedSlots: { customRender: 'costPrice' }
        }, {
          title: 'A价',
          dataIndex: 'priceA'
        }, {
          title: 'B价',
          dataIndex: 'priceB'
        }, {
          title: 'C价',
          dataIndex: 'priceC'
        },
        {
          title: '状态',
          width: '100px',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作人',
          dataIndex: 'modifier'
        },
        {
          title: '操作时间',
          dataIndex: 'modifyTime'
          // sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      productTypes: [],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getProductList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(function (err) {
            console.log(err)
          })
      }
    }
  },
  created () { // 初始化钩子,获取所有产品类型
    getDictionary({ text: '产品类型' }).then(res => {
      this.productTypes = res.data
    })
  },
  methods: {
    handleEdit (record) { // 修改
      this.$refs.priceEdit.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    changestatus (text, record) { // 改变状态
      let status = 0
      if (text === 0) {
        status = 1
      }
      this.$set(record, 'status', status)
      editProduct(record).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          console.log(res.msg)
        }
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>
