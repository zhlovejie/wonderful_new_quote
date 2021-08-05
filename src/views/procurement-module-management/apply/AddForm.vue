<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
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
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="addform-wrapper"
      >
      <div class="card-item">
        <div class="__hd">申请人信息</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">申请人</td>
              <td >
                <a-form-model-item prop="applyUser" v-if="!isDisabled">
                  <DepartmentUserCascade allowClear :info.sync="form.applyUser" style="width:360px;"/>
                </a-form-model-item>
                <span v-else>
                  {{detail.applyDepName}}/{{detail.proposerName}}
                </span>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">申请原因</td>
              <td >
                <a-form-model-item prop="reason" v-if="!isDisabled">
                  <a-input v-model="form.reason" type="textarea" />
                </a-form-model-item>
                <span v-else>
                  {{detail.reason}}
                </span>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">申请备注</td>
              <td >
                <a-form-model-item prop="remark" v-if="!isDisabled">
                  <a-input v-model="form.remark" type="textarea" />
                </a-form-model-item>
                <span v-else>
                  {{detail.remark}}
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="card-item">
        <div class="__hd">需求单信息</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">需求类型</td>
              <td >
                <a-form-model-item prop="requestType" v-if="!isDisabled">
                <CommonDictionarySelect
                  style="width: 360px"
                  allowClear
                  :text="'采购模块-需求类型'"
                  :dictionaryId.sync="form.requestType"
                  @selected="requestTypeSelectedHandler"
                />
                </a-form-model-item>
                <span v-else>
                  {{detail.requestTypeText}}
                </span>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">关联单号</td>
              <td >
                <!-- <a-form-model-item prop="relatedNum">
                  <a-input
                    v-model="form.relatedNum"
                    read-only="read-only"
                    style="width:360px;"
                    @click="openModel('choiceOrderFactory')"
                  />
                </a-form-model-item> -->

                <a-form-model-item prop="relatedNum" v-if="!isDisabled">
                  <a-select style="width: 360px" allowClear v-model="form.relatedNum" @change="relatedNumChange">
                    <a-select-option :value="1">测试1</a-select-option>
                    <a-select-option :value="2">测试2</a-select-option>
                    <a-select-option :value="3">测试3</a-select-option>
                  </a-select>
                </a-form-model-item>
                <span v-else>
                  {{detail.relatedNum}}
                </span>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">需求日期</td>
              <td >
                <a-form-model-item prop="requestTime" v-if="!isDisabled">
                  <a-date-picker
                    v-model="form.requestTime"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="需求日期"
                    style="width:360px;"
                  />
                </a-form-model-item>
                <span v-else>{{detail.requestTime}}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="card-item">
        <div class="__hd">需求物料</div>
        <div class="__bd">
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{index + 1}}</span>
            </div>
            <div slot="requestApplyNum" slot-scope="text, record, index">
              <span style="color:#999;" v-if="!isDisabled">自动生成</span>
              <span v-else>{{record.requestApplyNum}}</span>
            </div>
            <div slot="action" slot-scope="text, record, index">
              <template v-if="isAdd">
                <a href="javascript:void(0);" @click="materialAction('del',record)">删除</a>
              </template>

            </div>

            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item v-if="!isDisabled">
                <a-select
                  show-search
                  :value="record.materialCode"
                  placeholder="模糊搜索"
                  style="width: 180px;"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                  @search="(w) => materialFuzzyAction(w,true)"
                  @change="(key) => materialFuzzyHandleChange(key,{...record})"
                >
                  <a-spin
                    v-if="materialFuzzySearch.fetching"
                    slot="notFoundContent"
                    size="small"
                  />
                  <a-select-option
                    v-for="item in materialFuzzySearch.list"
                    :key="item.__key"
                    :value="item.materialCodeFormat"
                  >
                    {{ item.materialCodeFormat }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>{{record.materialCode}}</span>
            </div>

            <div slot="requestNum" slot-scope="text, record, index">
              <a-form-model-item v-if="!isDisabled">
                <a-input-number
                  v-model="record.requestNum"
                  style="width:80px;"
                  :min="0"
                  :step="1"
                  :precision="0"
                />
              </a-form-model-item>
              <span v-else>{{record.requestNum}}</span>
            </div>
            <div slot="requestTime" slot-scope="text, record, index">
              <a-form-model-item v-if="!isDisabled">
                <a-date-picker
                  style="width:160px !important;"
                  v-model="record.requestTime"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="需求日期"
                />
              </a-form-model-item>
              <span v-else>{{record.requestTime}}</span>
            </div>
            <div slot="mainUnit" slot-scope="text, record, index">
              {{ {1:'支',2:'把',3:'件'}[text] }}
            </div>


          </a-table>
          <a-button
            style="width:100%;"
            type="dashed"
            icon="plus"
            @click="materialAction('add')"
            v-if="(isAdd) && form.requestType && form.relatedNum"
          >新增需求物料</a-button>
        </div>
      </div>
      <div class="card-item">
        <div class="__hd">制单人</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">制单人</td>
              <td >{{detail.createdName || userInfo.trueName}}</td>
            </tr>
          </table>
        </div>
      </div>
      </a-form-model>
    </a-spin>
    <!--选择销售订单-->
    <ChoiceOrderFactory ref="choiceOrderFactory" @change="contractChange" />
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList ,productMaterialInfoPageList} from '@/api/routineMaterial'
import Approval from './Approval'
import {
  requestApplyDetail,
  requestApplyAdd,
  requestApplyUpdate,
  requestApplyApproval
} from '@/api/procurementModuleManagement'

import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ChoiceOrderFactory from './ChoiceOrderFactory'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '需求单号',
    dataIndex: 'requestApplyNum',
    scopedSlots: { customRender: 'requestApplyNum' }
  },
  {
    title: '需求类型',
    dataIndex: 'requestTypeText',
  },
  {
    title: '关联单号',
    dataIndex: 'relatedNum',
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
  },
  {
    title: '单位',
    dataIndex: 'mainUnit',
    scopedSlots: { customRender: 'mainUnit' }
  },
  {
    title: '当前库存',
    dataIndex: 'inventory',
  },
  {
    title: '需求数量',
    dataIndex: 'requestNum',
    scopedSlots: { customRender: 'requestNum' },
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime',
    scopedSlots: { customRender: 'requestTime' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  }
]

export default {
  components:{
    DepartmentUserCascade,
    CommonDictionarySelect,
    ChoiceOrderFactory,
    Approval
  },
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: {},
      rules: {
        applyUser:[
          { required: true, message: '请选择申请人' },
        ],
        reason:[
          { required: true, message: '请输入申请原因' },
        ],
        remark:[
          { required: true, message: '请输入申请备注' },
        ],
        requestType:[
          { required: true, message: '请选择需求类型' },
        ],
        relatedNum:[
          { required: true, message: '请选择关联单号' },
        ],
        requestTime:[
          { required: true, message: '请选择需求日期' },
        ]
      },
      detail: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource:[],
      requestTypeSelected:{},
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
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
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    },
    columns(){
      let col = [...columns]
      if(this.isDisabled){
        return col.slice(0,-1)
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
              on: { click: () => that.handleSubmit() },
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
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      if(!that.isAdd){
        let result = await requestApplyDetail({id:record.id}).then(res => res.data)
        that.detail = result
        that.form = {
          ...result,
          applyUser:{
            depId:result.applyDepId,
            depName:result.applyDepName,
            userId:result.proposerId,
            userName:result.proposerName
          }
        }
        that.dataSource = [
          {
            key:that._uuid(),
            ...that.detail,
            mainUnit:that.detail.unit,
            inventory:that.detail.inventory || 0
          }
        ]
      }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // console.log(that.form,that.dataSource)
          let {depId,depName,userId,userName} = that.form.applyUser
          let baseInfo = {
            ...that.form,
            applyDepId:depId,
            applyDepName:depName,
            proposerId:userId,
            proposerName:userName
          }
          delete baseInfo.applyUser
          let arr = []
          that.dataSource.map(item => {
            let _item = {...item}
            _item.requestTime = _item.requestTime.format('YYYY-MM-DD HH:mm:ss')
            arr.push({
              ...baseInfo,
              ..._item,
              saveType:1
            })
          })
          console.log(arr)

          const result = await Promise.all(arr.map(item => {
            return requestApplyAdd(item).then(res => {
              console.log(res)
              return res
            })
          }))

          console.log(result)

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
    relatedNumChange(v){

    },
    materialAction(type,record){
      const that = this
      let dataSource = [...that.dataSource]
      if(type === 'add'){
        dataSource.push({
          key:that._uuid(),
          relatedId:1,
          relatedNum:'XSHTtest001',
          requestType:'802',
          requestTypeText:'销售订单需求',
          unsafetyInventory:2,
          materialId:1,
          requestNum:0,
          inventory:0
        })
        that.dataSource = dataSource
      }else if(type === 'del'){
        that.dataSource = dataSource.filter(item => item.key !== record.key)
      }
    },
    requestTypeSelectedHandler(item){
      console.log(item)
      this.requestTypeSelected = item
    },
    contractChange(result) {
      let that = this
      switch(result.selectedKey){
        case 'invoiceSaleContract':
          // that.fillContract(result.record)
          break
        case 'invoicePresentOrder':
          // that.fillPresentOrder(result.record)
          break
        default:
          break
      }
    },
    openModel(name){
      this.$refs[name].query()
    },
    async materialFuzzyAction(wd,isFilter=false) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      // productMaterialInfoPageList

      let res = await Promise.all(
        [
          routineMaterialInfoPageList(_searchParam).then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          }),
          productMaterialInfoPageList(_searchParam).then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          })
        ]
      )
      let result = []
      if(isFilter){
        //显示 常规和成品的 自制和委外件，
        result = [...res[0],...res[1]].filter(item => [1,3].includes(+item.materialSource))
      }else{
        //显示 常规件 ，不过滤
        result = [...res[0]]
      }
      // console.log(res)
      result = result.map((item, index) => {
          item.__key = that._uuid()
          item.__value = item.materialName
          item.materialCodeFormat = that.formatMaterialCode(item.materialCode,".")
          item.__label = `${item.materialName}(${item.materialCodeFormat})`
          item.specifications = item.specification || `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
          return item
        })

      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
    },
    materialFuzzyHandleChange(key,record) {
      const that = this
      const material = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)
      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      target.materialId = material.id
      target.materialName = material.materialName
      target.mainUnit = material.mainUnit
      target.specification = 'specification' in material  ? (material.specification || material.specifications) : '无'
      target.materialCode = material.materialCodeFormat
      that.dataSource = dataSource

      that.materialFuzzySearch = { ...that.materialFuzzySearch, item: {...material} }
    },
    formatMaterialCode(codeStr,joinSymbol=""){
      if(typeof codeStr !== 'string'){
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,trimRight = /[0]*$/g;
      return codeStr.split('.').map(s => s.replace(trimLeft,'')).join(joinSymbol)
    },
    //审批部分
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      requestApplyApproval(values)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          if(+ res.code === 200){
            that.handleCancel()
            that.$emit('finished')
          }
        })
        .catch((err) => {
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
        opinion: opinion,
      })
    },
    //审批部分
  }
}
</script>

<style scoped>
.card-item {
  margin-bottom: 20px;
}
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ant-form-item{
  margin-bottom: 0;
}
.custom-table-border th, .custom-table-border td{
  padding: 10px;
  text-align: left;
}
.ant-alert-with-description.ant-alert-no-icon{
  padding: 5px 20px;
}
</style>


