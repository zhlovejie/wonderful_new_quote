<template>
  <a-modal
    :title="modalTitle"
    :width="1300"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-row>
        <a-col :span="8" class="basic-tit" justify="center" align="middle"
          >总实际收款：{{ allReceiveBigDecimal }}</a-col
        >
        <a-col :span="8" class="basic-tit" justify="center" align="middle">
          常规产品实际收款：{{ commonReceiveBigDecimal }}</a-col
        >
        <a-col :span="8" class="basic-tit" justify="center" align="middle"
          >智能产品实际收款：{{ regularReceiveBigDecimal }}</a-col
        >
      </a-row>
      <a-row>
        <a-col
          :span="24"
          class="basic-tit"
          style="margin-top: 30px; margin-bottom: 20px"
          justify="center"
          align="middle"
          >{{ month }}销售部收入统计表</a-col
        >
      </a-row>

      <a-table
        ref="table"
        class="productTab"
        :columns="columns"
        rowKey="key"
        :dataSource="dataSource"
        :pagination="false"
        bordered
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="salerHelper_type" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>常规产品</div>
            <div>智能产品</div>
            <div>合计</div>
          </div>
        </div>
        <div slot="salerHelper_currReceiveBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList1.currReceiveBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList1', 'currReceiveBigDecimal', e)"
              />
            </div>
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList2.currReceiveBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList2', 'currReceiveBigDecimal', e)"
              />
            </div>
            <div>
              {{ record.amountDetailVoList3.currReceiveBigDecimal }}
            </div>
          </div>
        </div>

        <div slot="salerHelper_currAdvanceBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList1.currAdvanceBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList1', 'currAdvanceBigDecimal', e)"
              />
            </div>
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList2.currAdvanceBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList2', 'currAdvanceBigDecimal', e)"
              />
            </div>
            <div>
              {{ record.amountDetailVoList3.currAdvanceBigDecimal }}
            </div>
          </div>
        </div>

        <div slot="salerHelper_currOwnBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList1.currOwnBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList1', 'currOwnBigDecimal', e)"
              />
            </div>
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList2.currOwnBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList2', 'currOwnBigDecimal', e)"
              />
            </div>
            <div>
              {{ record.amountDetailVoList3.currOwnBigDecimal }}
            </div>
          </div>
        </div>

        <div slot="salerHelper_currRefundBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              <a-input-number
                :disabled="isDisabled"
                style="width: 70%"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList1.currRefundBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList1', 'currRefundBigDecimal', e)"
              />
            </div>
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList2.currRefundBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList2', 'currRefundBigDecimal', e)"
              />
            </div>
            <div>
              {{ record.amountDetailVoList3.currRefundBigDecimal }}
            </div>
          </div>
        </div>

        <div slot="salerHelper_currTaxBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList1.currTaxBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList1', 'currTaxBigDecimal', e)"
              />
            </div>
            <div>
              <a-input-number
                :disabled="isDisabled"
                style="width: 70%"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList2.currTaxBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList2', 'currTaxBigDecimal', e)"
              />
            </div>
            <div>
              {{ record.amountDetailVoList3.currTaxBigDecimal }}
            </div>
          </div>
        </div>

        <div slot="salerHelper_currOtherBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              <a-input-number
                :disabled="isDisabled"
                style="width: 70%"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList1.currOtherBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList1', 'currOtherBigDecimal', e)"
              />
            </div>
            <div>
              <a-input-number
                style="width: 70%"
                :disabled="isDisabled"
                :min="0"
                :step="1"
                :precision="2"
                :value="record.amountDetailVoList2.currOtherBigDecimal"
                @change="(e) => numberChange(index, 'amountDetailVoList2', 'currOtherBigDecimal', e)"
              />
            </div>
            <div>
              {{ record.amountDetailVoList3.currOtherBigDecimal }}
            </div>
          </div>
        </div>

        <div slot="salerHelper_currRealityBigDecimal" slot-scope="text, record, index">
          <div class="bm-wrap">
            <div>
              {{ record.amountDetailVoList1.currRealityBigDecimal }}
            </div>
            <div>
              {{ record.amountDetailVoList2.currRealityBigDecimal }}
            </div>
            <div>
              {{ record.amountDetailVoList3.currRealityBigDecimal }}
            </div>
          </div>
        </div>
      </a-table>

      <a-row style="margin-top: 40px" v-if="isDisabled">
        <a-col :span="24" class="basic-tit" justify="center" align="middle">{{ month }}销售部提成奖金统计表</a-col>
      </a-row>
      <a-table v-if="isDisabled" :columns="baseColumns" :pagination="false" rowKey="id" :dataSource="saleCustomers">
      </a-table>

      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  sale_PercentageDetail,
  sale_ByDepId,
  sale_add,
  sale_SalerMonthCollectDetail,
  sale_ApprovalSalary,
} from '@/api/bonus_management'
import { getDictionaryList } from '@/api/workBox'
import Approval from './Approval'
import moment from 'moment'
let uuid = () => Math.random().toString(16).slice(-6) + '-' + Math.random().toString(16).slice(-6)
export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      dataSource: [],
      remark: '',
      visible: false,
      memberLoading: false,
      columns: [
        {
          title: '销售经理',
          align: 'center',
          dataIndex: 'salerUserName',
        },
        {
          title: '销售助理',
          align: 'center',
          dataIndex: 'salerHelperUserName',
        },
        {
          title: '分类',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'salerHelper_type' },
        },
        {
          title: '本期收款',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currReceiveBigDecimal' },
        },
        {
          title: '本期预收',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currAdvanceBigDecimal' },
        },
        {
          title: '本期收回欠款',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currOwnBigDecimal' },
        },
        {
          title: '本期退款',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currRefundBigDecimal' },
        },
        {
          title: '本期税金',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currTaxBigDecimal' },
        },
        {
          title: '本期其他(运费＋税金)',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currOtherBigDecimal' },
        },
        {
          title: '实际收款',
          align: 'center',
          scopedSlots: { customRender: 'salerHelper_currRealityBigDecimal' },
        },
      ],
      month: undefined,
      departmentId: undefined,
      saleCustomers: [],
      columns1: [
        {
          align: 'center',
          title: '姓名',
          key: 'userName',
          dataIndex: 'userName',
        },
        {
          align: 'center',
          title: '职位',
          dataIndex: 'stationName',
          key: 'stationName',
        },
        {
          align: 'center',
          title: '基本工资',
          dataIndex: 'salaryBigDecimal',
          key: 'salaryBigDecimal',
        },
        {
          align: 'center',
          title: '',
          key: 'salaryBig',
        },
      ],
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      assetTypeList: {},
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改销售提成奖金'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}销售提成奖金`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
    baseColumns() {
      let _columns = []
      if (this.assetTypeList.length > 0) {
        this.assetTypeList.map((_item, idx1) => {
          if (!_columns.find((c) => c.title === _item.text)) {
            _columns.push({
              title: _item.text,
              dataIndex: `bounsItemRetio_${_item.id}`,
              align: 'center',
            })
          }
        })
      }
      let __columns = [...this.columns1]
      let idx = __columns.findIndex((item) => item.key === 'salaryBig')
      if (idx >= 0) {
        __columns.splice(idx, 0, ..._columns)
      }

      return __columns
    },
    commonReceiveBigDecimal() {
      return this.dataSource.reduce((addr, item) => {
        addr = Number(addr) + Number(item.amountDetailVoList1.currRealityBigDecimal || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },

    regularReceiveBigDecimal() {
      return this.dataSource.reduce((addr, item) => {
        addr = Number(addr) + Number(item.amountDetailVoList2.currRealityBigDecimal || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },

    allReceiveBigDecimal() {
      return this.dataSource.reduce((addr, item) => {
        addr = Number(addr) + Number(item.amountDetailVoList3.currRealityBigDecimal || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
  },
  methods: {
    moment,

    numberChange(index, type, key, val) {
      let dataSource = [...this.dataSource]
      let target = dataSource[index]
      target[type][key] = val

      dataSource = this.calcItems(dataSource)

      this.dataSource = dataSource
    },
    calcItems(dataSource) {
      return dataSource.map((item) => {
        let { amountDetailVoList1: a1, amountDetailVoList2: a2, amountDetailVoList3: a3 } = item

        a1.currRealityBigDecimal =
          (parseFloat(a1.currReceiveBigDecimal) || 0) +
          (parseFloat(a1.currAdvanceBigDecimal) || 0) +
          (parseFloat(a1.currOwnBigDecimal) || 0) -
          (parseFloat(a1.currRefundBigDecimal) || 0) -
          (parseFloat(a1.currTaxBigDecimal) || 0) -
          (parseFloat(a1.currOtherBigDecimal) || 0)

        a2.currRealityBigDecimal =
          (parseFloat(a2.currReceiveBigDecimal) || 0) +
          (parseFloat(a2.currAdvanceBigDecimal) || 0) +
          (parseFloat(a2.currOwnBigDecimal) || 0) -
          (parseFloat(a2.currRefundBigDecimal) || 0) -
          (parseFloat(a2.currTaxBigDecimal) || 0) -
          (parseFloat(a2.currOtherBigDecimal) || 0)
        a3.currReceiveBigDecimal =
          (parseFloat(a1.currReceiveBigDecimal) || 0) + (parseFloat(a2.currReceiveBigDecimal) || 0)
        a3.currAdvanceBigDecimal =
          (parseFloat(a1.currAdvanceBigDecimal) || 0) + (parseFloat(a2.currAdvanceBigDecimal) || 0)
        a3.currOwnBigDecimal = (parseFloat(a1.currOwnBigDecimal) || 0) + (parseFloat(a2.currOwnBigDecimal) || 0)
        a3.currRefundBigDecimal =
          (parseFloat(a1.currRefundBigDecimal) || 0) + (parseFloat(a2.currRefundBigDecimal) || 0)
        a3.currTaxBigDecimal = (parseFloat(a1.currTaxBigDecimal) || 0) + (parseFloat(a2.currTaxBigDecimal) || 0)
        a3.currOtherBigDecimal = (parseFloat(a1.currOtherBigDecimal) || 0) + (parseFloat(a2.currOtherBigDecimal) || 0)
        a3.currRealityBigDecimal =
          (parseFloat(a1.currRealityBigDecimal) || 0) + (parseFloat(a2.currRealityBigDecimal) || 0)
        return { ...item, amountDetailVoList1: a1, amountDetailVoList2: a2, amountDetailVoList3: a3 }
      })
    },

    //接受数据
    query(type, record) {
      let _that = this
      _that.form.resetFields() // 清空表
      _that.visible = true
      _that.type = type
      _that.record = record
      getDictionaryList({ parentId: 616 }).then((res) => {
        _that.assetTypeList = res.data
      })

      if (type !== 'add') {
        _that.fillData()
      } else {
        _that.month = record.month
        _that.departmentId = record.departmentId
        sale_ByDepId({ id: record.departmentId }).then((res) => {
          this.dataSource = res.data.map((item) => {
            return {
              salerUserName: item.userName,
              salerHelperUserName: item.assistantuserName,
              salerHelperUserId: item.assistantId,
              salerUserId: item.userId,
              amountDetailVoList1: {
                type: 1,
                currReceiveBigDecimal: undefined,
                currAdvanceBigDecimal: undefined,
                currOwnBigDecimal: undefined,
                currRefundBigDecimal: undefined,
                currTaxBigDecimal: undefined,
                currOtherBigDecimal: undefined,
                currRealityBigDecimal: undefined,
              },
              amountDetailVoList2: {
                type: 2,
                currReceiveBigDecimal: undefined,
                currAdvanceBigDecimal: undefined,
                currOwnBigDecimal: undefined,
                currRefundBigDecimal: undefined,
                currTaxBigDecimal: undefined,
                currOtherBigDecimal: undefined,
                currRealityBigDecimal: undefined,
              },
              amountDetailVoList3: {
                type: 3,
                currReceiveBigDecimal: undefined,
                currAdvanceBigDecimal: undefined,
                currOwnBigDecimal: undefined,
                currRefundBigDecimal: undefined,
                currTaxBigDecimal: undefined,
                currOtherBigDecimal: undefined,
                currRealityBigDecimal: undefined,
              },
            }
          })
        })
      }

      if (type === 'view' || type === 'edit') {
        sale_SalerMonthCollectDetail({ departmentId: record.departmentId, month: record.month }).then((res) => {
          _that.saleCustomers = res.data.oaSalarySalerUserMonthCollectListVoList.map((item, index) => {
            item.key = index + 1
            let _item = { ...item }
            let detailList = [..._item.detailList]
            detailList.map((v) => {
              v.key = v.bounsDicId
              _item[`bounsItemRetio_${v.key}`] = v.bounsAmountBigDecimal
              return v
            })
            _item.detailList = detailList
            return _item
          })
        })
      }
    },
    // 详情
    fillData() {
      let that = this
      that.$nextTick(() => {
        sale_PercentageDetail({ id: that.record.id }).then((res) => {
          that.month = that.record.month
          that.dataSource = res.data.oaSalaryDeveloperPercentageStaticsUserVoList.map((i) => {
            return {
              salerUserName: i.salerUserName,
              salerHelperUserName: i.salerHelperUserName,
              salerHelperUserId: i.salerHelperUserId,
              salerUserId: i.salerUserId,
              amountDetailVoList1: i.amountDetailVoList[0],
              amountDetailVoList2: i.amountDetailVoList[1],
              amountDetailVoList3: i.amountDetailVoList[2],
            }
          })
        })
      })
    },
    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            let arr = {}
            if (that.type === 'edit-salary') {
              arr.id = that.record.id
            }
            if ((that.type === 'add' || that.type === 'edit-salary') && that.dataSource.length > 0) {
              arr.departmentId = that.record.departmentId
              arr.month = that.record.month
              arr.commonReceiveBigDecimal = that.commonReceiveBigDecimal
              arr.regularReceiveBigDecimal = that.regularReceiveBigDecimal
              arr.allReceiveBigDecimal = that.allReceiveBigDecimal

              arr.oaSalarySalerPercentageEarUserBoList = that.dataSource.map((_iten) => {
                return {
                  salerHelperUserId: _iten.salerHelperUserId,
                  salerUserId: _iten.salerUserId,
                  oaSalarySalerPercentageDetailBoList: [
                    _iten.amountDetailVoList1,
                    _iten.amountDetailVoList2,
                    _iten.amountDetailVoList3,
                  ],
                }
              })
            }
            that.spinning = true
            sale_add(arr)
              .then((res) => {
                if (res.code === 200) {
                  this.programme = []
                  this.visible = false
                  that.spinning = false
                  that.dataSource = []
                  that.$message.info(res.msg)
                  that.$emit('finish')
                } else {
                  that.$message.error(res.msg)
                  that.spinning = false
                }
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      sale_ApprovalSalary(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style >
.bm-wrap div:first-child {
  border: none;
}
.bm-wrap > div {
  height: 44px;
  line-height: 44px;
  border-top: 1px solid #dcdcdc;
  margin: 0 -16px;
  text-align: center;

  color: #333;
}
</style>