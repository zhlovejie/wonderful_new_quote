<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="search-wrapper">
      <a-input
        v-model.trim="queryParam.productName"
        :allowClear="true"
        style="width: 200px"
        placeholder="根据产品名称模糊查询"
      />
      <a-input
        v-model.trim="queryParam.newBasisModel"
        style="width: 200px; margin-left: 10px"
        placeholder="产品代码模糊查询"
        :allowClear="true"
      />

      <a-input
        v-model.trim="queryParam.valencySpecs"
        style="width: 200px; margin-left: 10px"
        placeholder="规格型号模糊查询"
        :allowClear="true"
      />
      <a-select
        placeholder="选择产品类型"
        v-model="queryParam.productCategory"
        :allowClear="true"
        style="width: 200px; margin-left: 10px"
      >
        <a-select-option v-for="item in products" :key="item.id" :value="item.id">
          {{ item.typeName }}
        </a-select-option>
      </a-select>
      <a-select
        placeholder="状态"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-left: 10px"
      >
        <a-select-option :value="0">启用</a-select-option>
        <a-select-option :value="1">禁用</a-select-option>
      </a-select>
      <template>
        <a-button type="primary" style="margin-left: 10px" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left: 10px" @click="() => (queryParam = {})">重置</a-button>
      </template>
    </div>

    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :pagination="pagination">
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <span slot="status" slot-scope="text, record, index">
        {{ text === 0 ? '启用' : '禁用' }}
      </span>

      <span slot="referencePic" slot-scope="text">
        <img style="height: 70px; lenght: 70px" :src="text" />
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'

import { saleValencyProductList, getDictionaryList } from '@/api/workBox'
import { typeConfigList } from '@/api/productOfferManagement'
export default {
  name: 'ProductPrice',
  components: {
    // 组件
    STable,
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      products: [],
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '产品名称',
          width: '170px',
          dataIndex: 'productName',
        },
        {
          title: '产品代码',
          dataIndex: 'newBasisModel',
        },
        {
          title: '产品类型',
          dataIndex: 'productTypeConfigName',
        },
        {
          title: '核价代码',
          dataIndex: 'productCode',
        },
        {
          title: '规格型号',
          width: '170px',
          dataIndex: 'valencySpecs',
        },

        {
          title: '效果图',
          dataIndex: 'referencePic',
          scopedSlots: { customRender: 'referencePic' },
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
        },
        {
          title: 'C价',
          dataIndex: 'cprice',
        },
        {
          title: '状态',
          width: '100px',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
      ],
      productTypes: [],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return saleValencyProductList(Object.assign(parameter, this.queryParam))
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
    typeConfigList().then((res) => (this.products = res.data))
    // 初始化钩子,获取所有产品类型
    // getDictionary({ text: '产品类型' }).then((res) => {
    //   this.productTypes = res.data
    // })
  },
  methods: {
    // //修改记录
    // handleModification(record) {
    //   this.$refs.modification.query(record)
    // },
    // handleEdit(record) {
    //   // 修改
    //   this.$refs.priceEdit.edit(record)
    // },
    // handleOk() {
    //   this.$refs.table.refresh()
    // },
    // changestatus(text, record) {
    //   // 改变状态
    //   let status = 0
    //   if (text === 0) {
    //     status = 1
    //   }
    //   this.$set(record, 'status', status)
    //   editProduct(record)
    //     .then((res) => {
    //       if (res.code === 200) {
    //         this.$refs.table.refresh()
    //       } else {
    //         console.log(res.msg)
    //       }
    //     })
    //     .catch(function (err) {
    //       console.log(err)
    //     })
    // },
    // getProductTypeText(id) {
    //   let target = this.productTypes.find((item) => +item.id === +id)
    //   return target ? target.text : ''
    // },
    // downloadAction() {
    //   let that = this
    //   downProductInformation(this.queryParam)
    //     .then((res) => {
    //       //console.log(res)
    //       if (res instanceof Blob) {
    //         const isFile = res.type === 'application/vnd.ms-excel'
    //         const isJson = res.type === 'application/json'
    //         if (isFile) {
    //           //返回文件 则下载
    //           const objectUrl = URL.createObjectURL(res)
    //           const a = document.createElement('a')
    //           document.body.appendChild(a)
    //           a.style = 'display: none'
    //           a.href = objectUrl
    //           a.download = `${that.pageTitle}.xls`
    //           a.click()
    //           document.body.removeChild(a)
    //           that.$message.info('下载成功')
    //           return
    //         } else if (isJson) {
    //           //返回json处理
    //           var reader = new FileReader()
    //           reader.onload = function (e) {
    //             let _res = null
    //             try {
    //               _res = JSON.parse(e.target.result)
    //             } catch (err) {
    //               _res = null
    //             }
    //             if (_res !== null) {
    //               if (_res.code !== 0) {
    //                 that.$message.info(_res.message)
    //               } else {
    //                 that.$message.info('下载成功')
    //               }
    //             } else {
    //               that.$message.info('json解析出错 e.target.result：' + e.target.result)
    //               return
    //             }
    //           }
    //           reader.readAsText(res)
    //         } else {
    //           that.$message.info('不支持的类型:' + res)
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       that.$message.info(`请求出错：${err.message}`)
    //     })
    // },
  },
}
</script>
