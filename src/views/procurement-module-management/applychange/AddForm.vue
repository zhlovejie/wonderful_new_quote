<template>
  <a-modal
    :title="modalTitle"
    :width="1250"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-alert type="warning">
        <div slot="description">
          需求说明：变更需求只允许减少需求数量，需求数量增加要新增需求；更改物料代码，只试用于相同物料代码变更，切记不可用于不同物料替换。
        </div>
      </a-alert>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="addform-wrapper">
        <div class="card-item">
          <div class="__hd">申请人信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">申请人</td>
                <td>
                  <a-form-model-item prop="applyUser">
                    <span> {{ detail.applyDepName }}/{{ detail.proposerName }} </span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">变更类型</td>
                <td>
                  <span>{{
                    { 1: '需求数量减少', 2: '更换物料代码', 3: '需求数量减少且更换物料代码' }[detail.changeStatus]
                  }}</span>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">申请原因</td>
                <td>
                  <a-form-model-item prop="reason" v-if="!isDisabled">
                    <a-input v-model="form.reason" type="textarea" />
                  </a-form-model-item>
                  <span v-else>
                    {{ detail.reason }}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">申请备注</td>
                <td>
                  <a-form-model-item prop="remark" v-if="!isDisabled">
                    <a-input v-model="form.remark" type="textarea" />
                  </a-form-model-item>
                  <span v-else>
                    {{ detail.remark }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card-item" v-if="isAdd">
          <div class="__hd">需求单信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">需求类型</td>
                <td>
                  <a-form-model-item>
                    <span>{{ detail.requestTypeText }}</span>
                  </a-form-model-item>
                </td>
              </tr>

              <tr>
                <td style="width:150px;">紧急程度</td>
                <td>
                  <a-form-model-item prop="urgencyDegree" v-if="!isDisabled">
                    <a-select placeholder="紧急程度" style="width: 360px" allowClear v-model="form.urgencyDegree">
                      <a-select-option :value="1">一般</a-select-option>
                      <a-select-option :value="2">加急</a-select-option>
                      <a-select-option :value="3">特急</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <span v-else>
                    {{ { 1: '一般', 2: '加急', 3: '特急' }[detail.urgencyDegree] }}
                  </span>
                </td>
              </tr>

              <tr>
                <td style="width:150px;">需求日期</td>
                <td>
                  <a-form-model-item prop="requestTime" v-if="!isDisabled">
                    <a-date-picker
                      v-model="form.requestTime"
                      :show-time="{ format: 'HH:mm' }"
                      format="YYYY-MM-DD HH:mm"
                      placeholder="需求日期"
                      style="width:360px;"
                    />
                  </a-form-model-item>
                  <span v-else>{{
                    detail.requestTime instanceof moment
                      ? detail.requestTime.format('YYYY-MM-DD HH:mm:ss')
                      : detail.requestTime
                  }}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="card-item">
          <div class="__hd">需求物料</div>
          <div class="__bd">
            <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
              <div slot="order" slot-scope="text, record, index">
                <span>{{ index + 1 }}</span>
              </div>
              <div slot="requestApplyNum" slot-scope="text, record, index">
                <span>{{ record.requestApplyNum || '自动生成' }}</span>
              </div>
              <div slot="action" slot-scope="text, record, index">
                <template v-if="(isAdd || isEdit) && (isChangeMaterial || isChangeNumberAndMaterial)">
                  <a href="javascript:void(0);" @click="materialAction('del', record)">删除</a>
                </template>
              </div>

              <div slot="materialCode" slot-scope="text, record, index">
                <a-form-model-item v-if="!isDisabled && (isChangeMaterial || isChangeNumberAndMaterial)">
                  <a-select
                    show-search
                    :value="record.materialCode"
                    placeholder="模糊搜索"
                    style="width:250px;"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                    @search="w => materialFuzzyAction(w, true)"
                    @change="key => materialFuzzyHandleChange(key, { ...record })"
                  >
                    <a-spin v-if="materialFuzzySearch.fetching" slot="notFoundContent" size="small" />
                    <a-select-option
                      v-for="item in materialFuzzySearch.list"
                      :key="item.__key"
                      :value="item.materialCodeFormat"
                    >
                      {{ item.__label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <span v-else>{{ record.materialCode }}</span>
              </div>

              <div slot="requestNum" slot-scope="text, record, index">
                <a-form-model-item v-if="!isDisabled && (isChangeNumber || isChangeNumberAndMaterial)">
                  <a-input-number
                    v-model="record.presentRequestNum"
                    style="width:80px;"
                    :min="0"
                    :step="1"
                    :precision="0"
                    @change="v => requestNumChange(v, record)"
                  />
                </a-form-model-item>
                <span v-else>
                  {{ record.presentRequestNum }}
                </span>
              </div>
              <div slot="requestTime" slot-scope="text, record, index">
                <a-form-model-item v-if="!isDisabled">
                  <a-date-picker
                    v-model="record.requestTime"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="需求日期"
                    style="min-width:auto;width:150px !important;"
                  />
                </a-form-model-item>
                <span v-else>
                  {{
                    record.requestTime instanceof moment
                      ? record.requestTime.format('YYYY-MM-DD HH:mm:ss')
                      : record.requestTime
                  }}
                </span>
              </div>
              <div slot="mainUnit" slot-scope="text, record, index">
                {{ { 1: '支', 2: '把', 3: '件' }[text] || text }}
              </div>

              <div slot="inventory" slot-scope="text, record, index">
                <span :style="{ color: +record.unsafetyInventory === 1 ? 'red' : '' }">{{ text }}</span>
              </div>

              <div slot="relatedNumText" slot-scope="text, record, index">
                <a-form-model-item prop="presentRequestNum" v-if="!isDisabled && record.__isRelated">
                  <a-input
                    v-model="record.presentRequestNum"
                    read-only="read-only"
                    style="width:260px;"
                    @click="
                      openModel('choiceOrderFactory', { callback: args => tableRelatedNumCallback(record, ...args) })
                    "
                  />
                </a-form-model-item>
                <span v-else>{{ text }}</span>
              </div>
            </a-table>
            <a-button
              style="width:100%;"
              type="dashed"
              icon="plus"
              @click="materialAction('add')"
              v-if="
                isAdd && form.requestType && (isChangeMaterial || isChangeNumberAndMaterial) && dataSource.length < 20
              "
              >新增需求物料</a-button
            >
          </div>
        </div>
        <div class="card-item" v-if="isDisabled">
          <div class="__hd">制单人</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">制单人</td>
                <td>{{ detail.updateName || detail.createdName }}</td>
                <td style="width:150px;">制单时间</td>
                <td style="width:260px;">{{ detail.updateTime || detail.createdTime }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="card-item" v-if="isDisabled && Array.isArray(priewData) && priewData.length > 0">
          <div class="__hd">审核结果</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">审核结果</td>
                <td>
                  {{ getStatusText(detail.approveStatus) }}
                </td>
                <td style="width:150px;">审核理由</td>
                <td>
                  {{ priewData[priewData.length - 1].code }}
                </td>
                <td style="width:150px;">审核人/审核时间</td>
                <td>
                  {{ priewData[priewData.length - 1].userName }}/{{ priewData[priewData.length - 1].createTime || '-' }}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="card-item" v-if="isDisabled && Array.isArray(detail.rejects) && detail.rejects.length > 0">
          <div class="__hd">驳回记录</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr v-for="item in detail.rejects" :key="item.createdTime">
                <td style="width:150px;">驳回理由</td>
                <td>{{ item.reason }}</td>
                <td style="width:150px;">驳回人/驳回时间</td>
                <td style="width:260px;">{{ item.createdName }}/{{ item.createdTime }}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 采购负责人审批 可以修改报价 -->
        <div v-if="isApproval && +userInfo.id === +purchaseUserId">
          <a-form-model-item label="是否变更报价">
            <a-radio-group :value="changeQuotationType" @change="handleQuotationType">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-spin>
    <!--选择销售订单-->
    <ChoiceOrderFactory ref="choiceOrderFactory" @change="contractChange" />
    <Approval ref="approval" @opinionChange="opinionChange" />
    <OfferPriceForm ref="offerPriceForm" @change="handleOfferPriceChange" />
  </a-modal>
</template>
<script>
import moment from 'moment'
//物料代码模糊搜索
import { routineMaterialInfoPageList, productMaterialInfoPageList } from '@/api/routineMaterial'
import { getBuyRequirement } from '@/api/routineMaterial'
import { findApprovedNodeList } from '@/api/common'
import Approval from './Approval'
import {
  requestApplyDetail,
  applyChangeDetail,
  applyChangeAudit,
  applyChangeAddOrUpdate
} from '@/api/procurementModuleManagement'

import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ChoiceOrderFactory from './ChoiceOrderFactory'
import OfferPriceForm from '../grab/OfferPriceForm'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 60
  },
  {
    title: '需求单号',
    dataIndex: 'requestApplyNum',
    scopedSlots: { customRender: 'requestApplyNum' },
    width: 200
  },
  {
    title: '需求类型',
    dataIndex: 'requestTypeText'
  },
  {
    title: '关联单号',
    dataIndex: 'relatedNumText',
    scopedSlots: { customRender: 'relatedNumText' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  // {
  //   title: '物料名称',
  //   dataIndex: 'materialName',
  // },
  {
    title: '单位',
    dataIndex: 'mainUnit',
    scopedSlots: { customRender: 'mainUnit' }
  },
  {
    title: '当前库存',
    dataIndex: 'inventory',
    scopedSlots: { customRender: 'inventory' }
  },
  {
    title: '需求数量',
    dataIndex: 'requestNum',
    scopedSlots: { customRender: 'requestNum' }
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime',
    scopedSlots: { customRender: 'requestTime' }
  },
  // {
  //   title: '操作',
  //   scopedSlots: { customRender: 'action' }
  // }
]

export default {
  components: {
    DepartmentUserCascade,
    CommonDictionarySelect,
    ChoiceOrderFactory,
    Approval,
    OfferPriceForm
  },
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    this.requestNumChange = this.$_.debounce(this.requestNumChange, 800)
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: {},
      rules: {
        applyUser: [{ required: true, message: '请选择申请人' }],
        reason: [{ required: true, message: '请输入申请原因' }],
        remark: [{ required: false, message: '请输入申请备注' }],
        requestType: [{ required: false, message: '请选择需求类型' }],
        relatedNum: [{ required: false, message: '请选择关联单号' }],
        requestTime: [{ required: true, message: '请选择需求日期' }],
        urgencyDegree: [{ required: true, message: '请选择紧急程度' }],
        presentRequestNum: [{ required: true, message: '请输入需求数量' }]
      },
      detail: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      relatedNumList: [
        { id: '1', label: '测试关联订单1', orderId: 1 },
        { id: '2', label: '测试关联订单2', orderId: 2 },
        { id: '3', label: '测试关联订单3', orderId: 3 }
      ],
      priewData: [],
      changeQuotationType: 0,
      OfferPriceParams: {}
    }
  },
  created() {},
  computed: {
    modalTitle() {
      let type = this.type
      
      return (type === 'add' && this.detail.changeStatus) ? '变更需求' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '审批'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    columns() {
      let col = [...columns]
      if (this.isDisabled) {
        // 查看是 不显示操作列
        col = col.slice(0, -1)
      }
      if (!this.isRelatedSellOrder) {
        //不关联订单的，不显示 关联订单列
        let idx = col.findIndex(item => item.dataIndex === 'relatedNumText')
        if (idx >= 0) {
          col.splice(idx, 1)
        }
      }
      if (this.isAdd) {
        //新增需求单号系统自动生成，先不显示，编辑和查看 显示
        let idx = col.findIndex(item => item.dataIndex === 'requestApplyNum')
        if (idx >= 0) {
          col.splice(idx, 1)
        }
      }

      return col
    },
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleSubmit(that.isAdd ? 1 : 2) },
              props: { type: 'primary', loading: that.spinning }
            },
            '提交审核'
          )
        )
      } else if (that.isApproval) {
        btn.push(
          h(
            'a-button',
            { key: 'no-pass', on: { click: that.noPassAction }, props: { loading: that.spinning } },
            '不通过'
          )
        )
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    },
    isRelatedSellOrder() {
      //需求 销售订单需要管理 单号
      const that = this
      let { requestType, relatedNum, requestTime } = that.form
      let relatedNumItem = that.relatedNumList.find(item => item.id === relatedNum)
      if (that.$refs['requestType']) {
        let requestTypeItem = that.$refs['requestType'].getTarget()
        return requestTypeItem && requestTypeItem.text && requestTypeItem.text.includes('销售订单')
      }
      return !!relatedNum
    },
    /** let m = {
          changeNumber: '1',
          changeMaterial: '2',
          changeNumberAndMaterial: '3'
        } */

    isChangeNumber() {
      return +this.detail.changeStatus === 1
    },
    isChangeMaterial() {
      return +this.detail.changeStatus === 2
    },
    isChangeNumberAndMaterial() {
      return +this.detail.changeStatus === 3
    },
    purchaseUserId() {
      return +this.detail.purchaseUserId
    }
  },
  methods: {
    moment,
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.form = {}
      that.dataSource = []
      that.OfferPriceParams = {}
      that.changeQuotationType = 0
      that.visible = true

      let result = null
      if (that.isAdd) {
        const { requestApplyRecord, changeStatus } = record
        result = await requestApplyDetail({ id: requestApplyRecord.id })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return null
          })
        result = {
          ...result,
          applyId: requestApplyRecord.id,
          changeStatus,
          id: null
        }
      } else {
        result = await applyChangeDetail({ id: record.id })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return null
          })
      }

      let materialRequirement = await getBuyRequirement({ materialId: result.materialId })
        .then(res => res.data || {})
        .catch(err => {
          console.log(err)
          return {}
        })

      that.detail = result
      that.form = {
        ...result,
        applyUser: {
          depId: result.applyDepId,
          depName: result.applyDepName,
          userId: result.proposerId,
          userName: result.proposerName
        },
        requestTime: moment(result.requestTime),
        reason:'',
        remark:''
      }
      that.dataSource = [
        {
          key: that._uuid(),
          ...that.detail,
          mainUnit: that.detail.unit,
          inventory: that.detail.inventory || materialRequirement.pageNum || 0,
          requestTime: moment(that.detail.requestTime),
          unsafetyInventory: that.detail.requestNum > (materialRequirement.pageNum || 0) ? 1 : 2,
          __maxBuyNumber: materialRequirement.pageNum || 0,
          relatedNumText: result.relatedNum,
          __isRelated: that.detail.requestTypeText.includes('销售订单'),
          presentRequestNum: that.detail.requestNum
        }
      ]

      if (that.isView || that.isApproval) {
        // 获取审批预览信息
        that.priewData = await findApprovedNodeList({ instanceId: that.detail.instanceId })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return []
          })
      }
    },
    validateMaterial() {
      const that = this
      let dataSource = [...that.dataSource]

      let errorArr = []
      dataSource.map(item => {
        let { materialCode, requestNum, requestTime } = item
        if (!materialCode) {
          that.$message.info('请选择物料')
          errorArr.push({ key: 'materialCode', msg: '请选择物料' })
        }
        if (!requestNum) {
          that.$message.info('请选择需求数量')
          errorArr.push({ key: 'requestNum', msg: '请选择需求数量' })
          hasError = true
        }
        if (!requestTime) {
          that.$message.info('请选择需求日期')
          errorArr.push({ key: 'requestTime', msg: '请选择需求日期' })
          hasError = true
        }
      })

      return { result: errorArr.length === 0, errorArr }
    },
    handleSubmit(saveType = 1) {
      const that = this
      that.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let params = {
            ...that.form
          }
          let arr = []
          that.dataSource.map(item => {
            let param = {
              ...item
            }
            param.requestTime = param.requestTime ? param.requestTime.format('YYYY-MM-DD HH:mm:ss') : undefined
            arr.push(param)
          })

          let materialStatus = that.validateMaterial()
          if (!materialStatus.result) {
            return
          }
          params.requestTime = params.requestTime ? params.requestTime.format('YYYY-MM-DD HH:mm:ss') : undefined
          // params.quotationChange = { ...arr[0] }
          params.changeQuotationType = 0

          params = {
            ...params,
            ...arr[0]
          }
          that.spinning = true

          applyChangeAddOrUpdate(params).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.$emit('finish')
              that.handleCancel()
            }
            return res
          })

          // const result = await Promise.all(arr.map(item => {
          //   return api(item).then(res => {
          //     console.log(res)
          //     return res
          //   })
          // })).catch(err => {
          //   that.spinning = false
          //   that.$message.info(err)
          //   return null
          // })
          // that.spinning = false

          // console.log(result)
          // if(result !== null){
          //     let msg = ''
          //     result.filter(res => res.code !== 200).map(res => {
          //       msg += `${res.msg}`
          //     })
          //     msg = msg || '操作成功'
          //     that.$message.info(msg)
          //     that.$emit('finish')
          //     that.handleCancel()
          // }

          // priceQuotedZktListAddOrUpdate(params)
          //   .then(res => {
          //     that.spinning = false
          //     that.$message.info(res.msg)
          //     that.$emit('finish')
          //     that.handleCancel()
          //   })
          //   .catch(err => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields()
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    },
    relatedNumChange(v) {},
    materialAction(type, record) {
      const that = this
      let dataSource = [...that.dataSource]
      if (type === 'add') {
        let { requestType, relatedNum, requestTime } = that.form
        let relatedNumItem = that.relatedNumList.find(item => item.id === relatedNum)
        let requestTypeItem = that.$refs['requestType'].getTarget()
        that.form = {
          ...that.form,
          relatedNumText: relatedNumItem ? relatedNumItem.label : undefined,
          requestTypeText: requestTypeItem.text
        }
        dataSource.push({
          key: that._uuid(),
          relatedId: relatedNumItem ? relatedNumItem.orderId : undefined,
          relatedNum: relatedNum,
          relatedNumText: relatedNumItem ? relatedNumItem.label : undefined,
          presentRequestNum: relatedNum,
          requestType: requestType,
          requestTypeText: requestTypeItem.text,
          __isRelated: requestTypeItem && requestTypeItem.text.includes('销售订单'),
          unsafetyInventory: 2, //是否大于安全库存：1是，2否
          materialId: undefined,
          requestNum: 0, //需求数量
          inventory: 0, //安全库存
          requestTime
        })
        that.dataSource = dataSource
      } else if (type === 'del') {
        that.$confirm({
          title: '删除提示',
          content: h => {
            return h('div', { style: { color: 'red' } }, '删除后无法恢复，请谨慎操作。')
          },
          onOk() {
            that.dataSource = dataSource.filter(item => item.key !== record.key)
          },
          onCancel() {}
        })
        return
      }
    },
    contractChange({ selectedKey, record, input }) {
      let that = this
      switch (selectedKey) {
        case 'invoiceSaleContract':
          // that.fillContract(record)
          break
        case 'invoicePresentOrder':
          // that.fillPresentOrder(record)
          break
        case 'SaleOrderReport':
          input.callback.call(that, record)
        default:
          break
      }
    },
    relatedNumCallback(record) {
      const that = this
      that.form = {
        ...that.form,
        relatedNum: record.orderNum
      }
    },
    tableRelatedNumCallback(record, selectRecord) {
      const that = this
      let dataSource = [...that.dataSource]
      let item = dataSource.find(item => item.key === record.key)
      item.relatedNum = selectRecord.orderNum
      that.dataSource = dataSource
    },
    openModel(name, input) {
      this.$refs[name].query(input)
    },
    async materialFuzzyAction(wd, isFilter = false) {
      const that = this
      /*校验是否中文名称组成 */
      function ischina(str) {
        var reg = /^[\u4E00-\u9FA5]+$/ /*定义验证表达式*/
        return reg.test(str) /*进行验证*/
      }

      const _searchParam = {
        current: 1,
        size: 50,
        materialCode: wd,
        materialName: wd
      }
      if (ischina(wd)) {
        _searchParam.materialCode = undefined
        _searchParam.materialName = wd
      } else {
        _searchParam.materialCode = wd
        _searchParam.materialName = undefined
      }

      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      // productMaterialInfoPageList

      let res = await Promise.all([
        routineMaterialInfoPageList(_searchParam).then(res => {
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return []
          }
          return res.data.records
        })
        // productMaterialInfoPageList(_searchParam).then(res => {
        //   if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
        //     return []
        //   }
        //   return res.data.records
        // })
      ])
      let result = []
      if (isFilter) {
        //显示 常规和成品的 自制和委外件，有规格型号的
        // result = [...res[0],...res[1]].filter(item => {
        //   return [1,3].includes(+item.materialSource) && typeof item.specification === 'string' && item.specification.length > 0
        // })

        //不限制
        result = [...res[0]]
      } else {
        //显示 常规件 ，不过滤
        result = [...res[0]]
      }
      // console.log(res)
      result = result.slice(0, 10)
      result = result.map((item, index) => {
        item.__key = that._uuid()
        item.__value = item.materialName
        item.materialCodeFormat = that.formatMaterialCode(item.materialCode, '.')
        item.__label = `${item.materialName}(${item.materialCodeFormat})`
        item.specifications =
          item.specification ||
          `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
        return item
      })

      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
    },
    async materialFuzzyHandleChange(key, record) {
      const that = this
      const material = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)

      let materialRequirement = await getBuyRequirement({ materialId: material.id })
        .then(res => res.data)
        .catch(err => {
          console.log(err)
          return {}
        })

      if (!materialRequirement) {
        materialRequirement = {}
      }

      if (!materialRequirement.pageNum) {
        that.$message.info(`物料【${material.materialName}】未设置最大采购量`)
      }

      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      target.materialId = material.id
      target.materialName = material.materialName
      target.mainUnit = material.mainUnit
      target.specification = 'specification' in material ? material.specification || material.specifications : '无'
      target.materialCode = material.materialCodeFormat
      // target.inventory = Math.floor(1+Math.random() * 1000) //测试数据，等仓库开发完再修改
      target.inventory = materialRequirement.pageNum || 0
      target.__maxBuyNumber = materialRequirement.pageNum || 0
      that.dataSource = dataSource

      that.materialFuzzySearch = { ...that.materialFuzzySearch, item: { ...material } }
    },
    formatMaterialCode(codeStr, joinSymbol = '') {
      if (typeof codeStr !== 'string') {
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,
        trimRight = /[0]*$/g
      return codeStr
        .split('.')
        .map(s => s.replace(trimLeft, ''))
        .join(joinSymbol)
    },
    requestNumChange(v, record) {
      const that = this
      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      target.presentRequestNum = v
      target.unsafetyInventory = +v > +target.__maxBuyNumber ? 1 : 2

      if (target.unsafetyInventory === 1) {
        let msg = `物料【${target.materialName}】的安全库存为【${target.__maxBuyNumber}】，本次采购需求量已超安全库存，确认需求超量采购吗？`
        that.$confirm({
          title: '安全库存提示',
          content: h => {
            return h('div', { style: { color: 'red' } }, msg)
          },
          onOk() {
            that.dataSource = dataSource
          },
          onCancel() {
            target.presentRequestNum = 0
            target.unsafetyInventory = 2
            that.dataSource = dataSource
          }
        })
      } else {
        that.dataSource = dataSource
      }
    },
    getStatusText(type) {
      let m = { 1: '待审批', 2: '通过', 3: '不通过', 4: '已经撤销', 5: '已被驳回' }
      return m[type]
    },
    //审批部分
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: that.detail.id })
      that.spinning = true
      applyChangeAudit(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.$emit('finish')
            that.handleCancel()
          }
        })
        .catch(err => {
          that.spinning = false
          console.log(err)
        })
    },
    passAction(opt = {}) {
      let params = Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {})
      params.changeQuotationType = this.changeQuotationType
      params.quotationChange = this.OfferPriceParams
      this.submitAction(params)
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },
    //审批部分
    handleQuotationType(e) {
      const that = this
      that.changeQuotationType = +e.target.value
      if (that.changeQuotationType === 1) {
        that.$refs.offerPriceForm.query('add', { ...that.detail, __isGetParams: true })
      } else {
        this.OfferPriceParams = {}
      }
      return
    },
    handleOfferPriceChange(params) {
      this.OfferPriceParams = params
    }
  }
}
</script>

<style scoped>
.card-item {
  margin-bottom: 20px;
}
.card-item:last-child {
  margin-bottom: 0;
}

.card-item >>> .ant-calendar-picker {
  min-width: none;
  width: auto;
}
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ant-form-item {
  margin-bottom: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
  text-align: left;
}
.ant-alert-with-description.ant-alert-no-icon {
  padding: 5px 20px;
}
</style>
