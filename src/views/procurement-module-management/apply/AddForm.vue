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
          采购部门会严格按照需求数量执行采购，为避免资金流转浪费及仓库占用，请确保每次物料需求数量合理，如需求量大建议分批申请采购。
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
                  <a-form-model-item prop="applyUser" v-if="!isDisabled">
                    <DepartmentUserCascade allowClear :info.sync="form.applyUser" style="width:360px;" />
                  </a-form-model-item>
                  <span v-else> {{ detail.applyDepName }}/{{ detail.proposerName }} </span>
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
                  <a-form-model-item prop="requestType" v-if="!isDisabled">
                    <a-select v-model="form.requestType" @change="handleRequestType">
                      <a-select-option
                        v-for="item in requestTypeList"
                        :key="item.id"
                        :value="item.id"
                      >{{ item.text }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <span v-else>
                    {{ detail.requestTypeText }}
                  </span>
                </td>
              </tr>
              <tr v-if="isRelatedOrder">
                <td style="width:150px;">关联单号</td>
                <td>
                  <a-form-model-item prop="relatedNum">
                    <a-input
                      v-model="form.relatedNum"
                      read-only="read-only"
                      style="width:360px;"
                      @click="handleChoiceRelatedNum"
                    />
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">紧急程度</td>
                <td>
                  <div style="display:flex;align-items: center;">
                    <div>
                      <a-form-model-item prop="urgencyDegree" v-if="!isDisabled">
                        <a-select placeholder="紧急程度" style="width:360px;" allowClear v-model="form.urgencyDegree">
                          <a-select-option :value="0">一般</a-select-option>
                          <!-- <a-select-option :value="1">紧急</a-select-option> -->
                          <a-select-option :value="2">紧急</a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <span v-else>{{ { 0: '一般', 1: '紧急', 2: '紧急' }[form.urgencyDegree] }}</span>
                    </div>
                    <span style="color:red;margin-left:20px;"
                      >注:谨慎选择紧急,必须当天到达,当天使用的才可以标记为紧急!</span
                    >
                  </div>
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
                <template v-if="isAdd">
                  <a href="javascript:void(0);" @click="materialAction('del', record)">删除</a>
                </template>
              </div>

              <div slot="specification" slot-scope="text, record, index">
                <a-popover title="物料信息" trigger="hover" style="max-width:600px;">
                  <template slot="content">
                    <div style="max-width:600px;">
                      <p>物料名称：{{ record.materialName }}</p>
                      <p>物料代码：{{ record.materialCode }}</p>
                      <p>规格型号：{{ record.materialModelType }}</p>
                      <p>单位：{{ record.mainUnit }}</p>
                      <p>路径：{{ record.materialRoute }}</p>
                    </div>
                  </template>
                  <a href="javascript:void(0);">
                    查看
                  </a>
                </a-popover>
              </div>

              <div slot="materialCode" slot-scope="text, record, index">
                <a-form-model-item v-if="!isDisabled">
                  <a-input
                    read-only="read-only"
                    :disabled="isDisabled"
                    @click="openModel(record)"
                    placeholder="请选择物料代码"
                    :value="record.materialCode"
                  />

                  <!-- <a-select
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
                  </a-select> -->
                </a-form-model-item>
                <span v-else>{{ record.materialCode }}</span>
              </div>

              <div slot="requestNum" slot-scope="text, record, index">
                <a-form-model-item v-if="!isDisabled">
                  <a-input-number
                    v-model="record.requestNum"
                    style="width:80px;"
                    :min="0"
                    :step="1"
                    :precision="0"
                    @change="v => requestNumChange(v, record)"
                  />
                </a-form-model-item>
                <span v-else>
                  {{ record.requestNum }}
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
                      ? record.requestTime.format('YYYY-MM-DD HH:mm')
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
                <span>{{ record.relatedNum }}</span>
                <!-- <a-form-model-item prop="relatedNum" v-if="!isDisabled && record.__isRelated">
                  <a-input
                    v-model="record.relatedNum"
                    read-only="read-only"
                    style="width:260px;"
                    @click="handleRelatedNumChange"
                  />
                </a-form-model-item>
                <span v-else>{{ text }}</span> -->
              </div>
            </a-table>
            <a-button
              style="width:100%;"
              type="dashed"
              icon="plus"
              @click="materialAction('add')"
              v-if="isAdd && form.requestType && dataSource.length < 20"
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
      </a-form-model>
    </a-spin>
    <!--选择销售订单-->
    <ChoiceOrderFactory ref="choiceOrderFactory" @change="contractChange" />
    <ChoiceTaskListDetailed ref="choiceTaskListDetailed" @change="taskListChange" />
    <Approval ref="approval" @opinionChange="opinionChange" />
    <MaterialSelect ref="materialSelect" @custom-change="handlerMaterialChange"/>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { getDictionary } from '@/api/common'
//物料代码模糊搜索
import { routineMaterialInfoPageList, productMaterialInfoPageList } from '@/api/routineMaterial'
import { getBuyRequirement ,getDetailByMaterialId} from '@/api/routineMaterial'
import { findApprovedNodeList } from '@/api/common'
import Approval from './Approval'
import {
  requestApplyDetail,
  requestApplyAdd,
  requestApplyUpdate,
  requestApplyApproval,
  listRecursiveSuperiorMaterialId
} from '@/api/procurementModuleManagement'

import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ChoiceOrderFactory from './ChoiceOrderFactory'
import ChoiceTaskListDetailed from './ChoiceTaskListDetailed'
import MaterialSelect from "./MaterialSelect"
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
  {
    title: '规格型号',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' }
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
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    DepartmentUserCascade,
    CommonDictionarySelect,
    ChoiceOrderFactory,
    ChoiceTaskListDetailed,
    Approval,
    MaterialSelect
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
      form: {
        urgencyDegree: 0
      },
      rules: {
        applyUser: [{ required: true, message: '请选择申请人' }],
        reason: [{ required: true, message: '请输入申请原因' }],
        remark: [{ required: true, message: '请输入申请备注' }],
        requestType: [{ required: true, message: '请选择需求类型' }],
        relatedNum: [{ required: false, message: '请选择关联单号' }],
        requestTime: [{ required: true, message: '请选择需求日期' }],
        urgencyDegree: [{ required: true, message: '请选择紧急程度' }]
      },
      detail: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      priewData: [],

      requestTypeList:[]
    }
  },
  created() {},
  computed: {
    modalTitle() {
      let type = this.type
      return type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '审批'
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
      if (!this.isRelatedOrder) {
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
            '提交'
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
      const that = this
      let { requestType } = that.form
      let target = that.requestTypeList.find(item => +item.id === +requestType)
      return target && target.text.includes('销售订单')
    },
    isTaskOrder(){
      const that = this
      let { requestType } = that.form
      let target = that.requestTypeList.find(item => +item.id === +requestType)
      return target && target.text.includes('售后任务单')
    },
    isRelatedOrder(){
      return this.isRelatedSellOrder || this.isTaskOrder
    }
  },
  methods: {
    moment,
    handleChoiceRelatedNum(){
      const that = this
      if(!(that.isAdd || that.isEdit)){
        return
      }
      if(that.isRelatedSellOrder){
        that.$refs['choiceOrderFactory'].query({ callback: that.relatedNumCallback })
        return
      }else if(that.isTaskOrder){
        that.$refs['choiceTaskListDetailed'].query()
        return
      }else{
        return
      }
    },
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.form = {}
      that.dataSource = []
      that.visible = true

      await getDictionary({text:'采购模块-需求类型'}).then(res => {
        that.requestTypeList = res.data
      });

      if (that.isAdd) {
        that.form = {
          urgencyDegree: 0,
          applyUser: {
            depId: that.userInfo.departmentId,
            depName: that.userInfo.departmentName,
            userId: that.userInfo.id,
            userName: that.userInfo.trueName
          }
        }
      }
      if (!that.isAdd) {
        let result = await requestApplyDetail({ id: record.id })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return null
          })
        if (!result) {
          that.$message.info('采购申请单详情接口【/requestApply】报错，请联系管理员')
          return
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
          requestTime: moment(result.requestTime)
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
            __isRelated:!!result.requestType
          }
        ]
      }

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
          let { depId, depName, userId, userName } = that.form.applyUser
          let { id, applyUser, reason, remark, requestType, relatedNum, requestTime,urgencyDegree } = that.form
          let baseInfo = {
            id,
            reason,
            remark,
            requestType,
            relatedNum,
            urgencyDegree,
            requestTime,
            applyDepId: depId,
            applyDepName: depName,
            proposerId: userId,
            proposerName: userName,
            saveType: saveType
          }
          let arr = []
          that.dataSource.map(item => {
            let param = {
              ...item,
              urgencyDegree
            }
            param.requestTime = param.requestTime ? param.requestTime.format('YYYY-MM-DD HH:mm:ss') : undefined
            arr.push(param)
          })

          let materialStatus = that.validateMaterial()
          if (!materialStatus.result) {
            return
          }

          that.spinning = true

          let api = that.isEdit ? requestApplyUpdate : requestApplyAdd

          api({ ...baseInfo, requestManageBos: arr }).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.$emit('finish')
              that.handleCancel()
            }
            return res
          })
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
        let { requestType,requestTypeText, relatedId,relatedNum,relatedNumText, requestTime } = that.form
        
        dataSource.push({
          key: that._uuid(),
          relatedId,
          relatedNum,
          relatedNumText,
          requestType,
          requestTypeText,
          __isRelated: that.isRelatedOrder,
          unsafetyInventory: 2, //是否大于最大采购量：1是，2否
          materialId: undefined,
          requestNum: 0, //需求数量
          inventory: 0, //最大采购量
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
    handleRequestType(val){
      const that = this
      let target = that.requestTypeList.find(item => +item.id === +val)
      that.form = {
        ...that.form,
        relatedNum: undefined,
        requestType:target.id,
        requestTypeText:target.text
      }
    },
    taskListChange({id,taskDocumentNum,accessoriesNum,orgName}){
      const that = this
      that.form = {
        ...that.form,
        relatedId:id,
        relatedNum: taskDocumentNum,
        relatedNumText:orgName
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
    relatedNumCallback({contractId,contractNum,customerName}) {
      const that = this
      that.form = {
        ...that.form,
        relatedId:contractId,
        relatedNum: contractNum,
        relatedNumText:customerName
      }
    },
    tableRelatedNumCallback(record, selectRecord) {
      const that = this
      let dataSource = [...that.dataSource]
      let item = dataSource.find(item => item.key === record.key)
      item.relatedNum = selectRecord.orderNum
      that.dataSource = dataSource
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
        materialName: wd,
        auditStatus:3,// auditStatus审核状态：1未审核，2审批中，3已审核
        isForbidden:2 // isForbidden是否禁用：1禁用，2启用
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

      let materialRoute = await listRecursiveSuperiorMaterialId({ruleId:material.ruleId,type:0}).then(res => {
        return res.data
      })

      let materialRequirement = await getBuyRequirement({ materialId: material.id })
        .then(res => res.data)
        .catch(err => {
          console.log(err)
          return {}
        })


      let inventoryQuantity = await getDetailByMaterialId({ materialId: material.id }).then(res => {
        return res && res.data ? (res.data.inventoryQuantity || 0) : 0
      }).catch(err => {
        return 0
      })

      if (!materialRequirement) {
        materialRequirement = {}
      }

      if (!materialRequirement.maxPurchase) {
        that.$message.info(`物料【${material.materialName}】未设置最大采购量`)
      }

      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      target.materialId = material.id
      target.materialName = material.materialName
      target.mainUnit = material.mainUnit
      target.specification = 'specification' in material ? material.specification || material.specifications : '无'
      target.materialModelType = target.specification
      target.materialRoute = materialRoute
      target.materialCode = material.materialCodeFormat
      // target.inventory = Math.floor(1+Math.random() * 1000) //测试数据，等仓库开发完再修改
      target.inventory = inventoryQuantity || 0
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
      target.requestNum = v
      target.unsafetyInventory = +v > +target.inventory ? 1 : 2

      if (target.unsafetyInventory === 1) {
        let msg = `物料【${target.materialName}】的最大采购量为【${target.inventory}】，本次采购需求量已超最大采购量，确认需求超量采购吗？`
        that.$confirm({
          title: '最大采购量提示',
          content: h => {
            return h('div', { style: { color: 'red' } }, msg)
          },
          onOk() {
            that.dataSource = dataSource
          },
          onCancel() {
            target.requestNum = 0
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
      requestApplyApproval(values)
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
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
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
    openModel(record) {
      if(this.isDisabled){
        return
      }
      this.$refs.materialSelect.query(record)
    },

    async handlerMaterialChange({selectItem, recordParam}) {
      const that = this
      const material = selectItem

      let materialRoute = await listRecursiveSuperiorMaterialId({ruleId:material.ruleId,type:0}).then(res => {
        return res.data
      })

      let materialRequirement = await getBuyRequirement({ materialId: material.id })
        .then(res => res.data)
        .catch(err => {
          console.log(err)
          return {}
        })


      let inventoryQuantity = await getDetailByMaterialId({ materialId: material.id }).then(res => {
        return res && res.data ? (res.data.inventoryQuantity || 0) : 0
      }).catch(err => {
        return 0
      })

      if (!materialRequirement) {
        materialRequirement = {}
      }

      if (!materialRequirement.maxPurchase) {
        that.$message.info(`物料【${material.materialName}】未设置最大采购量`)
      }

      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === recordParam.key)
      target.materialId = material.id
      target.materialName = material.materialName
      target.mainUnit = material.mainUnit
      target.specification = 'specification' in material ? material.specification || material.specifications : '无'
      target.materialModelType = target.specification
      target.materialRoute = materialRoute
      target.materialCode = material.materialCode
      // target.inventory = Math.floor(1+Math.random() * 1000) //测试数据，等仓库开发完再修改
      target.inventory = inventoryQuantity || 0
      target.__maxBuyNumber = materialRequirement.pageNum || 0
      that.dataSource = dataSource

    },
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
