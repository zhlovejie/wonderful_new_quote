<template>
  <div>
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
    </div>
    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="核价编号" :label-col="{ span: 3}" :wrapper-col="{ span:9 }">
              <a-input v-model="valencyCode" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="单据状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input v-if="valencyStatus===0" v-model="statusName" disabled placeholder="待接收" />
              <a-input v-else-if="valencyStatus===1" v-model="statusName" disabled />
              <a-input v-else-if="valencyStatus===2" v-model="statusName" disabled />
              <a-input v-else-if="valencyStatus===3" v-model="statusName" disabled />
              <a-input v-else-if="valencyStatus===4" v-model="statusName" disabled />
              <a-input v-else v-model="valencyStatus" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="客户名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">

              <a-input v-model="consumerId" hidden/>
              <a-input v-model="consumerName" disabled placeholder="客户名称"/>

              <!-- <a-select
                v-model="consumerId"
                class="select-part"
                placeholder="客户名称"
                disabled
              >
                <a-select-option
                  v-for="item in saleCustomers"
                  :key="item.id"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col :lg="{span: 12}" :md="{span: 12}" :sm="24">
            <a-form-item label="需求日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <span>{{ demandTime }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- table -->
    <a-card class="card" title="产品信息" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="data"
        :scroll="{ x: 2500 }"
        :pagination="false"
        :loading="memberLoading"
        rowKey="id"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="referencePic" slot-scope="text">
          <img style="height: 50px;lenght:40px" :src="text" />
        </div>
        <div slot="effectPic" slot-scope="text">
          <img style="height: 50px;lenght:40px" :src="text" />
        </div>

        <div slot="costPrice" slot-scope="text, record">
          <span v-if="+text === -1">***</span>
          <span v-else>{{text}}</span>
        </div>

      </a-table>
    </a-card>

    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="{span: 12}" :md="{span: 12}" :sm="24">
            <a-form-item label="申请人" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input placeholder="申请人" :value="applyUserName || ''" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="申请时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input v-model="createTime" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="核价说明" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-textarea :rows="4" v-model="explainText" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="核价人" :label-col="{ span: 3}" :wrapper-col="{ span:9 }">
              <a-select
                v-model="valencyUserId"
                class="select-part"
                placeholder="请选择核价人"
                disabled
              >
                <a-select-option
                  v-for="item in userList"
                  :key="item.id"
                  :value="item.id"
                >{{ item.trueName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { getlookApplyNuclear, getSelectsList } from '../../../api/pricingModule'
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
    title: '所依据产品代码',
    dataIndex: 'productModel',
    key: 'productModel',
    width: '150px'
  },
  {
    align: 'center',
    title: '需求数量',
    dataIndex: 'demandNumber',
    key: 'demandNumber',
    width: '100px'
  },
  {
    align: 'center',
    title: '规格',
    dataIndex: 'specs',
    key: 'specs',
    width: '100px'
  },
  {
    align: 'center',
    title: '需求描述',
    dataIndex: 'demandRemarks',
    key: 'demandRemarks',
    width: '250px'
  },
  {
    align: 'center',
    title: '产品区域',
    dataIndex: 'oldAreaText',
    key: 'oldAreaText',
    width: '150px'
  },
  {
    align: 'center',
    title: '参考图片',
    dataIndex: 'referencePic',
    key: 'referencePic',
    scopedSlots: { customRender: 'referencePic' },
    width: '150px'
  },
  {
    align: 'center',
    title: '修改点',
    dataIndex: 'revisedPart',
    key: 'revisedPart',
    width: '150px'
  },
  {
    align: 'center',
    title: '新产品区域',
    dataIndex: 'areaText',
    key: 'areaText',
    width: '150px'
  },
  {
    align: 'center',
    title: '成本价',
    dataIndex: 'costPrice',
    key: 'costPrice',
    scopedSlots: { customRender: 'costPrice' },
    width: '150px'
  },
  {
    align: 'center',
    title: 'A价',
    dataIndex: 'aprice',
    key: 'aprice'
  },
  {
    align: 'center',
    title: 'B价',
    dataIndex: 'bprice',
    key: 'bprice'
  },
  {
    align: 'center',
    title: 'C价',
    dataIndex: 'cprice',
    key: 'cprice'
  },
  {
    align: 'center',
    title: '效果图',
    dataIndex: 'effectPic',
    key: 'effectPic',
    scopedSlots: { customRender: 'effectPic' },
    width: '150px'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'valencySpecs',
    key: 'valencySpecs',
    width: '250px'
  },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'newBasisModel',
    key: 'newBasisModel',
    width: '200px'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '200px'
  }
]
export default {
  name: 'LookNuclearPrice',
  components: {},
  props: {},
  data () {
    return {
      columns: columns,
      loading: false,
      memberLoading: false,
      data: [],
      form: this.$form.createForm(this),
      basicInfo: {},
      userList: [], // 核价用户列表
      createTime: '', // 申请时间
      applyUserName: '', // 申请人
      explainText: '', // 核价说明
      valencyStatus: 0, // 单据状态
      statusName: '', // 单据状态名称
      saleCustomers: {}, // 客户名称数组
      demandTime: '', // 需求日期
      valencyCode: '', // 核价编号
      valencyUserId: 0, // 核价人id
      consumerId:-1,
      consumerName:'',
    }
  },
  watch: {
    $route (to, from) {
      if (from.fullPath === '/sales-management/pricing-module/pricing') {
        this.init()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getValencyCode()
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'pricing' })
    },
    handleSubmit (e) {
      e.preventDefault()
    },

    // 获取核价流水号、客户信息下拉、核价用户下拉列表
    getValencyCode () {
      getSelectsList().then(res => {
        console.log('获取核价流水号、客户信息下拉、核价用户下拉列表', res)
        this.basicInfo = res.data || {}
        this.userList = res.data.userList
        this.saleCustomers = res.data.saleCustomers
        this.getlookInfo()
      })
      .catch(error => {
        console.error(error)
      })
    },
    // 获取查看页面的数据
    getlookInfo () {
      const params = this.$route.params
      console.log('从查看页面跳转过来带来的参数', params)
      // 调取订单详情查询 接口
      getlookApplyNuclear(params)
        .then(res => {
          console.log('//调取订单详情查询 接口', res)
          this.data = res.data.valencyProducts
          this.valencyCode = res.data.valencyCode
          this.explainText = res.data.explainText
          this.demandTime = res.data.demandTime
          this.createTime = res.data.createTime
          this.applyUserName = res.data.applyUserName
          this.valencyUserId = res.data.valencyUserId
          this.consumerId = res.data.consumerId
          this.consumerName = res.data.consumerName
          if (res.data.valencyStatus === 0) {
            this.statusName = '待接收'
          } else if (res.data.valencyStatus === 1) {
            this.statusName = '已接收待核价'
          } else if (res.data.valencyStatus === 2) {
            this.statusName = '驳回'
          } else if (res.data.valencyStatus === 3) {
            this.statusName = '合价通过'
          } else if (res.data.valencyStatus === 4) {
            this.statusName = '待审批'
          } else {
            this.statusName = '审批通过'
          }
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.top-right {
  margin-bottom: 12px;
  margin-right: 6px;
}

.clearfix:after {
  display: block;
  content: '';
  width: 100%;
  height: 0;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.fl-r {
  float: right;
  margin-left: 8px;
}

.card {
  margin-bottom: 24px;
}

.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}

.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;

  i {
    margin-right: 4px;
  }
}

.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }

  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }

  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
