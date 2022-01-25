<template>
  <a-modal
    title="选择产品"
    :width="860"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="物料代码">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="materialCode" />
        </a-form-item>
        <a-form-item label="物料名称">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="materialName" />
        </a-form-item>
        <a-form-item label="客户名称" v-if="this.queryParam.productType === 1">
          <a-input class="modal-input" v-model="customerName" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading" class="marg-t16">
      <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" rowKey="id">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="materialCode" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
        <!--        <template slot="productPic" slot-scope="text">-->
        <!--          <img style="width:50px;height:auto;border:none;" :src="text"/>-->
        <!--        </template>-->
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { productMaterialInfoPageList } from '@/api/routineMaterial'
import { listMaterialInfoByCodes } from '@/api/distribution-management'

export default {
  name: 'materialCode',
  components: {
    STable,
  },
  data() {
    return {
      first: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {},
      customerName: '',
      loading: true,
      saleUsers: [],
      materialName: '',
      productType: 0,
      seriesFlag: '',
      userId: 0,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '产品代码',
          dataIndex: 'materialCode',
          scopedSlots: { customRender: 'materialCode' },
        },
        {
          title: '产品名称',
          dataIndex: 'materialName',
        },
        // {
        //   title: '规格型号',
        //   dataIndex: 'materialCode',
        //   key: 'materialCode',
        // },
      ],

      columnsData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParam = {
          auditStatus: 3,
          materialCode: this.materialCode || '',
          materialName: this.materialName || '',
          isForbidden: 2,
        }
        console.log('---------开始加载列表数据' + JSON.stringify(this.queryParam))
        // 常规非常规产品 根据不同的产品获取产品代码和产品数据
        return productMaterialInfoPageList(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log('res===', res)
          return res
          console.log('//常规非常规产品 根据不同的产品获取产品代码和产品数据res.data', res.data)
        })
      },
      materialCode: '', // 产品代码
      nuclearPriceModel: '', // 核价编号
      recordParam: null,
    }
  },
  computed: {},
  watch: {},
  cerated() {},
  mounted() {},
  methods: {
    query(record) {
      // this.mdl = Object.assign({}, record)
      // debugger
      this.recordParam = record
      this.visible = true

      try {
        console.log('---------seriesFlag:' + this.seriesFlag)
        this.$refs.table.refresh(true)
      } catch (err) {}
    },
    // 查询
    search() {
      this.queryParam = {
        productType: this.productType,
        materialCode: this.materialCode,
        materialName: this.materialName,
        customerName: this.customerName || '',
        valencyCode: this.valencyCode || '',
        seriesFlag: this.seriesFlag || '',
      }
      this.$refs.table.refresh(true)
    },
    // 关闭弹窗函数
    close() {
      this.$emit('close')
      this.visible = false
    },
    // 点击产品代码执行关闭弹窗函数
    clickVue(data) {
      console.log(data)
      // listMaterialInfoByCodes({ codes: data.materialCode }).then((res) => {
      //   if (res.code === 200 && res.data[0]) {
      //     data.squareNum = res.data[0].squareNum
      this.$emit('custom-change', {
        selectItem: data, //用户选择项目
        recordParam: this.recordParam, //父页面传过来的项目
        //   })
        //   this.close()
        // } else {
        //   this.$message.error('此数据没有配置方数')
        // }
      })
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
.marg-t16 {
  margin-top: 16px;
}
.modal-input {
  width: 100px;
}
</style>
