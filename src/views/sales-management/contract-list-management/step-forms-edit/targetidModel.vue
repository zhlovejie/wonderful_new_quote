<template>
  <!--标的名称弹出层 begin!-->
  <a-modal
    title="操作"
    :width="716"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="marg-t16">
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="loadData"
        :alert="false"
        rowKey="id"
        :pagination="false"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="targetName" slot-scope="text, record">
          <a @click="clickVue(record)">{{ record.text }}</a>
        </span>
        <!--                    <a-select-->
        <!--                      v-decorator="['targetId',{initialValue:0}, {rules: [{ required: true, message: '请选择标的名称' }]}]"-->
        <!--                      placeholder="请选择标的名称"-->
        <!--                      @change="idSelectChange(record,$event)"-->
        <!--                      style="width: 100%">-->
        <!--                      <a-select-option v-for="item in targetList" :key="item.id">{{item.text}}</a-select-option>-->
        <!--                    </a-select>-->
      </a-table>

    </a-spin>
  </a-modal>
  <!--end 标的名称弹出层 -->
</template>

<script>
import { STable } from '@/components'
import { getTarget } from '@/api/contractListManagement'
export default {
  name: 'TargetidModel',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      queryParam: {
        productType: this.productType
      },
      customerName: '',
      loading: true,
      saleUsers: [],
      productName: '',
      userId: 0,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '标的名称',
          dataIndex: 'targetName',
          scopedSlots: { customRender: 'targetName' }
        },
        {
          title: '税率',
          dataIndex: 'tax'
        }
      ],
      targetId: 0, // 标的id
      nuclearPriceModel: '', // 核价编号
      loadData: []
    }
  },
  computed: {},
  watch: {},
  cerated () {
    console.log('从父页面传来的productType', this.productType)
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      getTarget().then((res) => {
        console.log('返回关联字典表 智能/非智能/软件/其他', res)
        this.loadData = res.data
        this.targetId = res.data.id
        this.tax = res.data.tax
        this.targetName = res.data.text
      }).catch(error => {
        console.error(error)
      })
    },
    query (record) {
      console.log('query record' + JSON.stringify(record))
      this.visible = true
      this.productType = record.productType
      if (this.productType === 1) {
        this.columns = this.columns1
      }
      this.queryParam = { 'productType': record.productType }
      if (!this.first) {
        this.first = true
      } else {
        // this.$refs.table.refresh(true)
      }
    },
    // 关闭弹窗函数
    close () {
      this.$emit('close')
      this.visible = false
    },
    // 点击产品代码执行关闭弹窗函数
    clickVue (data) {
      this.$emit('custom-change', data)
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
