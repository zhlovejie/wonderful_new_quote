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
                  ref="requestType"
                  style="width: 360px"
                  allowClear
                  :text="'采购模块-需求类型'"
                  :dictionaryId.sync="form.requestType"
                />
                </a-form-model-item>
                <span v-else>
                  {{detail.requestTypeText}}
                </span>
              </td>
            </tr>
            <tr v-if="isRelatedSellOrder">
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
                  <a-select  style="width: 360px" allowClear v-model="form.relatedNum" @change="relatedNumChange">
                    <a-select-option
                      v-for="item in relatedNumList"
                      :key="item.id"
                      :value="item.id"
                    >
                    {{item.label}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <span v-else>
                  {{detail.relatedNum || '无'}}
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
                <span v-else>{{detail.requestTime instanceof moment ? detail.requestTime.format('YYYY-MM-DD HH:mm:ss') : detail.requestTime}}</span>
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
                  style="width:250px;"
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
                    {{ item.__label }}
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
                  @change="v => requestNumChange(v,record)"
                />
              </a-form-model-item>
              <span v-else>
                {{record.requestNum}}
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
                {{record.requestTime instanceof moment ? record.requestTime.format('YYYY-MM-DD HH:mm:ss') : record.requestTime}}
              </span>
            </div>
            <div slot="mainUnit" slot-scope="text, record, index">
              {{ {1:'支',2:'把',3:'件'}[text] || text }}
            </div>

            <div slot="inventory" slot-scope="text, record, index">
              <span :style="{'color': +record.unsafetyInventory === 1 ? 'red' : ''}">{{text}}</span>
            </div>

          </a-table>
          <a-button
            style="width:100%;"
            type="dashed"
            icon="plus"
            @click="materialAction('add')"
            v-if="(isAdd) && form.requestType && dataSource.length < 20"
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
              <td style="width:150px;">制单时间</td>
              <td style="width:260px;">{{ detail.createdTime}}</td>
            </tr>

            <tr v-if="detail.modifyTime">
              <td style="width:150px;">修改人</td>
              <td >{{detail.modifierName}}</td>
              <td style="width:150px;">修改时间</td>
              <td style="width:260px;">{{ detail.modifyTime}}</td>
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
              <td >{{detail.reason }}</td>
              <td style="width:150px;">驳回人/驳回时间</td>
              <td style="width:260px;">{{detail.createdName}}/{{detail.createdTime}}</td>
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
import moment from 'moment'
//物料代码模糊搜索
import { routineMaterialInfoPageList ,productMaterialInfoPageList} from '@/api/routineMaterial'
import { getBuyRequirement } from '@/api/routineMaterial'
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
    scopedSlots: { customRender: 'order' },
    width:60,
  },
  {
    title: '需求单号',
    dataIndex: 'requestApplyNum',
    scopedSlots: { customRender: 'requestApplyNum' },
    width:200,
  },
  {
    title: '需求类型',
    dataIndex: 'requestTypeText',
  },
  {
    title: '关联单号',
    dataIndex: 'relatedNumText',
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' },
  },
  // {
  //   title: '物料名称',
  //   dataIndex: 'materialName',
  // },
  {
    title: '单位',
    dataIndex: 'mainUnit',
    scopedSlots: { customRender: 'mainUnit' },
  },
  {
    title: '当前库存',
    dataIndex: 'inventory',
    scopedSlots: { customRender: 'inventory' },
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
    this.requestNumChange = this.$_.debounce(this.requestNumChange, 800)
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
          { required: false, message: '请选择关联单号' },
        ],
        requestTime:[
          { required: true, message: '请选择需求日期' },
        ]
      },
      detail: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource:[],
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      relatedNumList:[
        {id:1,label:'测试关联订单1',orderId:1},
        {id:2,label:'测试关联订单2',orderId:2},
        {id:3,label:'测试关联订单3',orderId:3},
      ]
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
      if(this.isDisabled){ // 查看是 不显示操作列
        col = col.slice(0,-1)
      }
      if(!this.isRelatedSellOrder){ //不关联订单的，不显示 关联订单列
        let idx = col.findIndex(item => item.dataIndex === 'relatedNumText')
        if(idx >= 0){
          col.splice(idx,1)
        }
      }
      if(this.isAdd){ //新增需求单号系统自动生成，先不显示，编辑和查看 显示
        let idx = col.findIndex(item => item.dataIndex === 'requestApplyNum')
        if(idx >= 0){
          col.splice(idx,1)
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
    isRelatedSellOrder(){ //需求 销售订单需要管理 单号
      const that = this
      let {requestType,relatedNum,requestTime} = that.form
      let relatedNumItem = that.relatedNumList.find(item => item.id === relatedNum)
      if(that.$refs['requestType']){
        let requestTypeItem = that.$refs['requestType'].getTarget()
        return requestTypeItem && requestTypeItem.text && requestTypeItem.text.includes('销售订单')
      }
      return !!relatedNum
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
      that.visible = true
      if(that.isAdd){
        that.form = {
          applyUser:{
            depId:that.userInfo.departmentId,
            depName:that.userInfo.departmentName,
            userId:that.userInfo.id,
            userName:that.userInfo.trueName
          }
        }
      }
      if(!that.isAdd){
        let result = await requestApplyDetail({id:record.id}).then(res => res.data).catch(err => {
          console.log(err)
          return null
        })
        if(!result){
          that.$message.info('采购申请单详情接口【/requestApply】报错，请联系管理员')
          return
        }

        let materialRequirement = await getBuyRequirement({ materialId: result.materialId })
        .then((res) => res.data || {})
        .catch(err => {
          console.log(err)
          return {}
        })

        that.detail = result
        that.form = {
          ...result,
          applyUser:{
            depId:result.applyDepId,
            depName:result.applyDepName,
            userId:result.proposerId,
            userName:result.proposerName
          },
          requestTime:moment(result.requestTime),

        }
        that.dataSource = [
          {
            key:that._uuid(),
            ...that.detail,
            mainUnit:that.detail.unit,
            inventory:that.detail.inventory || 0,
            requestTime:moment(that.detail.requestTime),
            unsafetyInventory:that.detail.requestNum > (materialRequirement.pageNum || 0) ? 1 : 2,
            __maxBuyNumber:materialRequirement.pageNum || 0,
            relatedNumText:result.relatedNum
          }
        ]
      }
    },
    handleSubmit(saveType=1) {
      const that = this
      that.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let {depId,depName,userId,userName} = that.form.applyUser
          let {id,applyUser,reason,remark,requestType,relatedNum,requestTime} = that.form
          let baseInfo = {
            id,
            reason,
            remark,
            requestType,
            relatedNum,
            // requestTime,
            applyDepId:depId,
            applyDepName:depName,
            proposerId:userId,
            proposerName:userName,
            saveType:saveType
          }
          let arr = []
          that.dataSource.map(item => {
            let param = {
              ...item,
              // ...baseInfo,
              // saveType:saveType
            }
            param.requestTime = param.requestTime.format('YYYY-MM-DD HH:mm:ss')
            arr.push(param)
          })

          that.spinning = true

          let api = that.isEdit ? requestApplyUpdate : requestApplyAdd

          api({...baseInfo,requestManageBos:arr}).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if(+res.code === 200){
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
    relatedNumChange(v){

    },
    materialAction(type,record){
      const that = this
      let dataSource = [...that.dataSource]
      if(type === 'add'){
        let {requestType,relatedNum,requestTime} = that.form
        let relatedNumItem = that.relatedNumList.find(item => item.id === relatedNum)
        let requestTypeItem = that.$refs['requestType'].getTarget()
        that.form = {
          ...that.form,
          relatedNumText:relatedNumItem ? relatedNumItem.label : undefined,
          requestTypeText:requestTypeItem.text
        }
        dataSource.push({
          key:that._uuid(),
          relatedId:relatedNumItem ? relatedNumItem.orderId : undefined,
          relatedNum:relatedNum,
          relatedNumText:relatedNumItem ? relatedNumItem.label : undefined,
          requestType:requestType,
          requestTypeText:requestTypeItem.text,
          unsafetyInventory:2, //是否大于安全库存：1是，2否
          materialId:undefined,
          requestNum:0,//需求数量
          inventory:0, //安全库存
          requestTime
        })
        that.dataSource = dataSource
      }else if(type === 'del'){
        that.$confirm({
          title: '删除提示',
          content: h => {
            return h('div',{style:{color:'red'}},'删除后无法恢复，请谨慎操作。')
          },
          onOk() {
            that.dataSource = dataSource.filter(item => item.key !== record.key)
          },
          onCancel() {

          }
        });
        return
      }
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
      /*校验是否中文名称组成 */
      function ischina(str) {
          var reg=/^[\u4E00-\u9FA5]+$/;   /*定义验证表达式*/
          return reg.test(str);     /*进行验证*/
      }

      const _searchParam = {
        current: 1,
        size: 50,
        materialCode: wd,
        materialName: wd
      }
      if(ischina(wd)){
        _searchParam.materialCode = undefined
        _searchParam.materialName = wd
      }else{
        _searchParam.materialCode = wd
        _searchParam.materialName = undefined
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
        //显示 常规和成品的 自制和委外件，有规格型号的
        result = [...res[0],...res[1]].filter(item => {
          return [1,3].includes(+item.materialSource) && typeof item.specification === 'string' && item.specification.length > 0
        })
      }else{
        //显示 常规件 ，不过滤
        result = [...res[0]]
      }
      // console.log(res)
      result = result.slice(0,10)
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
    async materialFuzzyHandleChange(key,record) {
      const that = this
      const material = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)

      let materialRequirement = await getBuyRequirement({ materialId: material.id })
        .then((res) => res.data)
        .catch(err => {
          console.log(err)
          return {}
        })

      if(!materialRequirement){
        materialRequirement = {}
      }

      if(!materialRequirement.pageNum){
        that.$message.info(`物料【${material.materialName}】未设置最大采购量`)
      }

      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      target.materialId = material.id
      target.materialName = material.materialName
      target.mainUnit = material.mainUnit
      target.specification = 'specification' in material  ? (material.specification || material.specifications) : '无'
      target.materialCode = material.materialCodeFormat
      // target.inventory = Math.floor(1+Math.random() * 1000) //测试数据，等仓库开发完再修改
      target.inventory = materialRequirement.pageNum || 0
      target.__maxBuyNumber = materialRequirement.pageNum || 0
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
    requestNumChange(v,record){
      const that = this
      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      target.requestNum = v
      target.unsafetyInventory = +v > +target.__maxBuyNumber ? 1 : 2

      if(target.unsafetyInventory === 1){
        let msg = `物料【${target.materialName}】的安全库存为【${target.__maxBuyNumber}】，本次采购需求量已超安全库存，确认需求超量采购吗？`
        that.$confirm({
          title: '安全库存提示',
          content: h => {
            return h('div',{style:{color:'red'}},msg)
          },
          onOk() {
            that.dataSource = dataSource
          },
          onCancel() {
            target.requestNum = 0
            target.unsafetyInventory = 2
            that.dataSource = dataSource
          }
        });
      }else{
        that.dataSource = dataSource
      }


    },
    //审批部分
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: that.detail.id })
      that.spinning = true
      requestApplyApproval(values)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          if(+ res.code === 200){
            that.$emit('finish')
            that.handleCancel()
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
.card-item:last-child{
  margin-bottom: 0;
}

.card-item >>> .ant-calendar-picker{
  min-width: none;
  width: auto;
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


