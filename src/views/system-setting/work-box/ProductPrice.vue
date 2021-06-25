<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="search-wrapper">
      <a-input
        v-model.trim="queryParam.productName"
        :allowClear="true"
        style="width: 200px"
        placeholder="根据名称模糊查询"
      />
      <a-input
        v-model.trim="queryParam.productModel"
        style="width: 200px; margin-left: 10px"
        placeholder="产品代码模糊查询"
        :allowClear="true"
      />

      <a-input
        v-model.trim="queryParam.productStandard"
        style="width: 200px; margin-left: 10px"
        placeholder="规格型号模糊查询"
        :allowClear="true"
      />

      <a-select
        style="width: 200px; margin-left: 10px"
        v-model.trim="queryParam.productTypeConfigId"
        placeholder="产品类型"
        :allowClear="true"
      >
        <a-select-option v-for="ptype in productTypes" :key="ptype.index" :value="ptype.id">{{
          ptype.typeName
        }}</a-select-option>
      </a-select>

      <template v-if="$auth('productPrice:list')">
        <a-button type="primary" style="margin-left: 10px" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left: 10px" @click="() => (queryParam = {})">重置</a-button>
      </template>
      <template v-if="$auth('productPrice:download')">
        <a-button style="margin-left: 10px" type="primary" icon="download" @click="downloadAction">下载</a-button>
      </template>
    </div>

    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :pagination="pagination">
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <span slot="costPrice" slot-scope="text">
        <span v-if="$auth('productPrice:add') || $auth('productPrice:eidt')">{{ text }}</span>
        <span v-else>***</span>
      </span>
      <!-- <span slot="productTypeText" slot-scope="text">
        {{ getProductTypeText(text) }}
      </span> -->
      <span slot="productPic" slot-scope="text">
        <img style="height: 70px; lenght: 70px" :src="text" />
      </span>
      <span slot="status" slot-scope="text, record">
        <template v-if="$auth('productPrice:eidt')">
          <a-switch
            checkedChildren="启用"
            :defaultChecked="text === 0 ? true : false"
            unCheckedChildren="禁用"
            @change="changestatus(text, record)"
          />
        </template>
        <template v-if="!$auth('productPrice:eidt')">
          <span v-if="text === 0">启用</span>
          <span v-if="text === 1">禁用</span>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <template v-if="$auth('productPrice:add')">
            <a
              @click="handleEdit('add', record)"
              v-if="record.costPrice == null && record.priceA == null && record.priceB == null && record.priceC == null"
              >新增</a
            >
          </template>
          <template v-if="$auth('productPrice:eidt')">
            <a
              @click="handleEdit('eidt', record)"
              v-if="record.costPrice != null || record.priceA != null || record.priceB != null || record.priceC != null"
              >修改</a
            >
          </template>
          <template v-if="$auth('productPrice:modification')">
            <a
              @click="handleModification(record)"
              v-if="record.costPrice != null || record.priceA != null || record.priceB != null || record.priceC != null"
              ><a-divider type="vertical" />修改记录</a
            >
          </template>
        </template>
      </span>
    </s-table>
    <price-edit ref="priceEdit" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
    <Modification ref="modification" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import priceEdit from './modules/priceEdit'
import Modification from './modules/Modification'
import Preview from './modules/Preview'
import { getProductList, delProduct, editProduct, downProductInformation } from '@/api/workBox'
import { typeConfigList } from '@/api/productOfferManagement'

export default {
  name: 'ProductPrice',
  components: {
    // 组件
    STable,
    priceEdit,
    Preview,
    Modification,
  },
  data() {
    return {
      // 查询参数
      queryParam: { isPrice: 0, isSale: 0 },
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '名称',
          width: '150px',
          dataIndex: 'productName',
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
        },
        {
          title: '规格型号',
          width: '150px',
          dataIndex: 'productStandard',
        },
        {
          title: '产品类型',
          dataIndex: 'productTypeConfigName',
          // scopedSlots: { customRender: 'productTypeText' },
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          scopedSlots: { customRender: 'costPrice' },
        },
        {
          title: 'C价',
          dataIndex: 'priceC',
        },
        {
          title: '状态',
          width: '100px',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作人',
          dataIndex: 'modifier',
        },
        {
          title: '操作时间',
          dataIndex: 'modifyTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      productTypes: [],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getProductList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      pageTitle: '产品价格',
    }
  },
  created() {
    // 初始化钩子,获取所有产品类型
    typeConfigList().then((res) => {
      this.productTypes = res.data
    })
  },
  methods: {
    //修改记录
    handleModification(record) {
      this.$refs.modification.query(record)
    },
    handleEdit(type, record) {
      // 修改
      this.$refs.priceEdit.edit(type, record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    changestatus(text, record) {
      // 改变状态
      let status = 0
      if (text === 0) {
        status = 1
      }
      this.$set(record, 'status', status)
      editProduct(record)
        .then((res) => {
          if (res.code === 200) {
            this.$refs.table.refresh()
          } else {
            console.log(res.msg)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    // getProductTypeText(id) {
    //   let target = this.productTypes.find((item) => +item.id === +id)
    //   return target ? target.text : ''
    // },
    downloadAction() {
      let that = this
      downProductInformation(this.queryParam)
        .then((res) => {
          //console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `${that.pageTitle}.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => {
          that.$message.info(`请求出错：${err.message}`)
        })
    },
  },
}
</script>
