<template>
  <div class="re-apply-nuclear-price-wrapper">
    <a-spin :spinning="spinning">
      <a-form :form="form" class="form">
        <div class="top-right clearfix">
          <a-button class="fl-r" type="primary" @click="goSubmit" icon="check">提交</a-button>
          <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
        </div>
        <a-card class="card" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="核价单编号" hidden>
                <a-input v-decorator="['id']" disabled />
              </a-form-item>
              <a-form-item label="实例编号" hidden>
                <a-input v-decorator="['instanceId']" disabled />
              </a-form-item>
              <a-form-item label="核价编号">
                <a-input v-decorator="['valencyCode']" placeholder="系统自动生成" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="单据状态" hidden>
                <a-input v-decorator="['valencyStatus']" placeholder="单据状态" disabled />
              </a-form-item>
              <a-form-item label="单据状态">
                <a-input v-decorator="['valencyStatusTxt']" placeholder="单据状态" disabled />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="销售人员" hidden>
                <a-input v-decorator="['salerId']" placeholder="人员编号" disabled />
              </a-form-item>
              <a-form-item label="销售人员">
                <a-input v-decorator="['salerUserName']" placeholder="销售人员" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="客户编号" hidden>
                <a-input v-decorator="['consumerId']" placeholder="客户编号" disabled />
              </a-form-item>
              <a-form-item label="客户名称">
                <a-input v-decorator="['consumerName']" placeholder="客户名称" disabled />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="需求日期">
                <a-date-picker
                  v-decorator="[
                    'demandTime',
                    { rules: [{ required: true, message: '需求日期' }], initialValue: moment() },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card class="card" title="产品信息" :bordered="false">
          <a-table :columns="columns" :dataSource="data" :pagination="false">
            <template slot="productModel" slot-scope="text, record">
              <a-input :value="text" read-only="read-only" @click="openModel(record)" />
            </template>
            <template slot="demandNumber" slot-scope="text, record">
              <a-input-number :precision="0" :min="0" :value="text" @change="quantityRequiredChange(record, $event)" />
            </template>
            <template slot="specs" slot-scope="text">
              <div v-html="formatSpecifiCation(text)"></div>
            </template>
            <template slot="demandRemarks" slot-scope="text, record">
              <a-textarea autosize :value="text" @change="requirementDescriptionChange(record, $event)" />
            </template>
            <template slot="productArea" slot-scope="text">
              <span>{{ text }}</span>
            </template>
            <template slot="referencePic" slot-scope="text">
              <img style="height: 50px; lenght: 40px" :src="text" />
            </template>
            <template slot="revisedPart" slot-scope="text, record">
              <a-select
                mode="multiple"
                style="width: 150px"
                @change="partChange(record, $event)"
                placeholder="请选择修改点"
                :defaultValue="text ? text.split(',') : undefined"
              >
                <a-select-option v-for="rPart in revisedParts" :key="rPart.text">{{ rPart.text }}</a-select-option>
              </a-select>
            </template>
            <template slot="status" slot-scope="text, record">
              <a-switch
                @change="statusChange(record, $event)"
                checked-children="启用"
                un-checked-children="禁用"
                :checked="+text === 0 ? true : false"
                :disabled="true"
              />
            </template>
            <template slot="operation" slot-scope="text, record">
              <template v-if="record.editable">
                <span v-if="record.isNew">
                  <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="saveRow(record)">保存</a>
                  <a-divider type="vertical" />
                  <a @click="cancel(record.key)">取消</a>
                </span>
              </template>
            </template>
          </a-table>
          <a-button
            style="width: 100%; margin-top: 16px; margin-bottom: 8px"
            type="dashed"
            icon="plus"
            @click="newMember"
            >添加行</a-button
          >
        </a-card>

        <a-card class="card" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="申请人编号" hidden>
                <a-input placeholder="申请人编号" v-decorator="['applyUserId']" disabled />
              </a-form-item>
              <a-form-item label="申请人">
                <a-input placeholder="申请人" v-decorator="['applyUserName']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="申请时间">
                <a-date-picker
                  disabled
                  v-decorator="[
                    'createTime',
                    { rules: [{ required: true, message: '需求日期' }], initialValue: moment() },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="核价说明">
                <a-textarea disabled placeholder="核价说明,多行输入" :rows="4" v-decorator="['explainText']" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="核价人">
                <a-select
                  placeholder="请选择核价人"
                  v-decorator="['valencyUserId', { rules: [{ required: true, message: '请选择核价人' }] }]"
                >
                  <a-select-option v-for="item in userList" :key="item.id">{{ item.trueName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
      <product-model ref="productModel" @custom-change="productChange" :productType="0"></product-model>
    </a-spin>
  </div>
</template>

<script>
import { getSelectsList, priceOrderAdd, saleValencySaveAndUpdate, getlookApplyNuclear } from '@/api/pricingModule'
import BasicPricingInformation from './BasicPricingInformation'
import ProductModel from '@/views/sales-management/contract-list-management/step-forms/productModel.vue'
import { getDictionary } from '@/api/common'
import moment from 'moment'
let columns = [
  {
    align: 'center',
    title: '所依据产品代码',
    dataIndex: 'productModel',
    key: 'productModel',
    scopedSlots: { customRender: 'productModel' },
  },
  {
    align: 'center',
    title: '需求数量',
    dataIndex: 'demandNumber',
    key: 'demandNumber',
    scopedSlots: { customRender: 'demandNumber' },
  },
  {
    align: 'center',
    title: '规格',
    dataIndex: 'specs',
    key: 'specs',
    scopedSlots: { customRender: 'specs' },
  },
  {
    align: 'center',
    title: '需求描述',
    dataIndex: 'demandRemarks',
    key: 'demandRemarks',
    scopedSlots: { customRender: 'demandRemarks' },
  },
  // {
  //   align: 'center',
  //   title: '产品区域',
  //   dataIndex: 'productArea',
  //   key: 'productArea',
  //   scopedSlots: { customRender: 'productArea' },
  // },
  {
    align: 'center',
    title: '参考图片',
    dataIndex: 'referencePic',
    key: 'referencePic',
    scopedSlots: { customRender: 'referencePic' },
  },
  // {
  //   align: 'center',
  //   title: '修改点',
  //   dataIndex: 'revisedPart',
  //   key: 'revisedPart',
  //   scopedSlots: { customRender: 'revisedPart' },
  // },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '操作',
    key: 'action',
    width: '160px',
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  name: 'ReApplyNuclearPrice',
  components: {
    ProductModel,
  },
  data() {
    return {
      loading: false,
      columns: columns,
      data: [],
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      spinning: false,
      id: null,
      userList: [],
      revisedParts: [], //核价修改点列表
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    moment: moment,
    async init() {
      let that = this
      that.id = that.$route.params.id
      let task1 = getSelectsList().then((res) => {
        let {
          code, //核价流水号
          userList, //核价用户下拉列表
          valencyStatus, //初始核价单状态
        } = res.data
        that.userList = userList
      })
      //核价修改点
      let task2 = getDictionary({ text: '核价修改点' }).then((res) => (that.revisedParts = res.data))
      //获取核价单信息
      let task3 = getlookApplyNuclear({ id: that.id }).then((res) => res.data)

      let result = await Promise.all([task1, task2, task3])
      //填充数据
      that.fillData(result[2])
    },
    fillData(data) {
      console.log(data)
      //基本的信息填充
      let that = this
      that.form.setFieldsValue({
        id: data.id,
        instanceId: data.instanceId,
        valencyCode: data.valencyCode,
        valencyStatus: data.valencyStatus,
        valencyStatusTxt: that.getValencyStatusTxt(data.valencyStatus),
        demandTime: that.moment(data.demandTime),
        consumerId: data.consumerId,
        consumerName: data.consumerName,
        applyUserId: data.applyUserId,
        salerId: data.salerId,
        salerUserName: data.salerUserName,
        applyUserName: data.applyUserName,
        createTime: that.moment(data.createTime),
        valencyUserId: data.valencyUserId,
        explainText: data.explainText || '',
      })

      //填充产品列表
      that.data = []
      data.valencyProducts.map((item, index) => {
        that.data.push({
          key: String(index + 1),
          productId: item.id, //产品编号
          productModel: item.productModel, //产品代码
          basisModel: item.basisModel, //产品代码
          demandNumber: item.demandNumber, //数量
          specs: item.specs, //规格
          demandRemarks: item.demandRemarks, //需求描述
          productArea: item.oldAreaText, //产品区域
          referencePic: item.referencePic, //产品图片
          revisedPart: item.revisedPart, //修改点
          status: item.status,
          editable: true,
          isNew: true,
        })
      })
    },
    // 返回
    goBack() {
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'pricing' })
    },
    // 订单详情查询:获取页面需要的的信息
    getOrderInfo() {
      let that = this
      // 调取订单详情查询 接口
      getlookApplyNuclear({ id: that.id })
        .then((res) => {
          console.log('//调取订单详情查询 接口', res)
          // let fillabcPriceObj = {}
          // this.data = res.data.valencyProducts.map((item, index) => {
          //   item.__index = index
          //   item.key = index + 1
          //   fillabcPriceObj[`record.${index}.aPrice`] = item.aprice
          //   fillabcPriceObj[`record.${index}.bPrice`] = item.bprice
          //   fillabcPriceObj[`record.${index}.cPrice`] = item.cprice
          //   return item
          // })

          // that.form.setFieldsValue(fillabcPriceObj)

          // console.log('调取接口返回值的valencyProducts塞给表格的data', this.data)
          // this.instanceId = res.data.instanceId
          // this.valencyCode = res.data.valencyCode
          // this.explainText = res.data.explainText
          // this.demandTime = res.data.demandTime
          // this.valencyUserName = res.data.valencyUserName
          // this.applyUserName = res.data.applyUserName
          // this.applyUserId = res.data.applyUserId
          // this.createTime = res.data.createTime
          // this.consumerId = res.data.consumerId
          // this.receiveId = res.data.receiveId
          // this.id = this.$route.params.id
          // this.valencyUserId = res.data.valencyUserId
          // this.valencyStatus = res.data.valencyStatus
          // this.receiveTime = res.data.receiveTime
          // if (res.data.valencyStatus === 0) {
          //   this.statusName = '待接收'
          // } else if (res.data.valencyStatus === 1) {
          //   this.statusName = '已接收待核价'
          // } else if (res.data.valencyStatus === 2) {
          //   this.statusName = '驳回'
          // } else if (res.data.valencyStatus === 3) {
          //   this.statusName = '合价通过'
          // } else if (res.data.valencyStatus === 4) {
          //   this.statusName = '待审批'
          // } else {
          //   this.statusName = '审批通过'
          // }

          // if (this.isUpdateType && parseInt(this.valencyStatus) === 5) {
          //   this.columns = [
          //     ...this.columns,
          //     {
          //       align: 'center',
          //       title: '产品代码',
          //       dataIndex: 'newBasisModel',
          //       key: 'newBasisModel',
          //       width: '200px',
          //       scopedSlots: { customRender: 'newBasisModel' }
          //     }
          //   ]
          // } else {

          // }
          //that.form.setFieldsValue(res.data)
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    goSubmit() {
      let that = this
      if (that.data.length <= 0) {
        that.$message.error('请添加产品后，再提交信息')
        return
      }
      //增加产品信息验证
      for (let i = 0, len = that.data.length; i < len; i++) {
        let item = that.data[i]
        if (item.productModel === '') {
          that.$message.error('请选择依据产品代码')
          return
        }
        if (item.demandNumber <= 0) {
          that.$message.error('需求数量必须大于零')
          return
        }
        if (item.demandRemarks.length === 0) {
          that.$message.error('请输入需求描述')
          return
        }
        // if (item.revisedPart.length === 0) {
        //   that.$message.error('请选择修改点')
        //   return
        // }
      }

      that.form.validateFields((err, values) => {
        console.log('点击提交，看看获取父页面那些信息', values)
        if (!err) {
          values.createTime && delete values.createTime
          // values.createTime = values.createTime instanceof  that.moment
          //   ? values.createTime.format('YYYY-MM-DD')
          //   : values.createTime
          values.demandTime =
            values.demandTime instanceof that.moment ? values.demandTime.format('YYYY-MM-DD') : values.demandTime

          values.valencyProducts = that.data.map((item) => Object.assign({}, item))

          // console.log(values)
          // return
          that.spinning = true
          saleValencySaveAndUpdate(values)
            .then((res) => {
              that.spinning = false
              console.log('提交申请请求接口的结果', res)
              that.$router.push({ name: 'pricing' })
              that.$destroy('ApplyNuclearPrice')
            })
            .catch((error) => {
              that.spinning = false
              console.error(error)
            })
        } else {
          return false
        }
      })
    },
    getValencyStatusTxt(status) {
      let map = {
        0: '待接收',
        1: '已接收待核价',
        2: '驳回',
        3: '合价通过',
        4: '待审批',
        5: '审批通过',
        9: '已撤回',
      }
      return map[status] || '未知'
    },
    // 添加行
    newMember() {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        basisModel: '', //产品代码
        productModel: '',
        demandNumber: 0, //数量
        specs: '', //规格
        demandRemarks: '', //需求描述
        productArea: '', //产品区域
        referencePic: '', //产品图片
        revisedPart: '', //修改点
        editable: true,
        isNew: true,
      })
    },
    // 删除行
    remove(key) {
      const newData = this.data.filter((item) => item.key !== key)
      this.data = newData
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 产品代码弹出框
    openModel(record) {
      this.openKey = record.key
      console.log('openKey :' + this.openKey)
      this.$refs.productModel.query({ productType: 0, seriesFlag: '1' })
    },
    productChange(data) {
      // debugger
      console.log('JSON 页面传值事件:' + JSON.stringify(data))
      let selectItem = Object.assign({}, data.selectItem)
      let target = this.data.find((item) => item.key === this.openKey)
      if (target) {
        target.productId = selectItem.id
        //target.basisModel = selectItem.basisModel
        target.basisModel = selectItem.id
        target.productModel = selectItem.productModel
        target.specs = selectItem.productStandard //规格
        target.referencePic = selectItem.productPic // 参考图片   ------
        target.productArea = selectItem.productArea // 产品区域  ----
      }
    },
    // 需求数量变化
    quantityRequiredChange(record, e) {
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['demandNumber'] = e
      }
    },
    // 需求描述变化
    requirementDescriptionChange(record, e) {
      const v = e.currentTarget.value
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['demandRemarks'] = v.trim()
      }
    },
    // 修改点变化
    partChange(record, e) {
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['revisedPart'] = e.join(',')
      }
    },
    formatSpecifiCation(str) {
      //格式化规格显示
      if (str === null || str === undefined || str === '') {
        return `<span>${str}</span>`
      }
      let items = str.split('\n')
      let itemsStr = items.map((s) => `<li>${s}</li>`).join('')
      return `<ol style="text-align: left;">${itemsStr}</ol>`
    },
    statusChange(record, status) {
      //console.log(status)
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['status'] = status ? 0 : 1
      }
    },
  },
}
</script>

<style scoped>
.top-right {
  margin-bottom: 12px;
  margin-right: 6px;
}

.card {
  margin-bottom: 24px;
}

.re-apply-nuclear-price-wrapper .ant-form-item {
  display: flex;
}
.re-apply-nuclear-price-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 120px;
}
.re-apply-nuclear-price-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
</style>


