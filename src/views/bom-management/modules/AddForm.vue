<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="bom-management-wrapper"
      >
        <div class="card-item">
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">BOM单组别</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span>{{form.bomGroupName || form.groupName}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">BOM单编号</td>
                <td style="width:350px;">
                  <a-form-model-item prop="bomCode">
                    <span>{{form.bomCode || '系统自动生成'}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>状态</td>
                <td>
                  <a-form-model-item prop="useStatus">
                    <a-select
                      v-if="!isDisabled"
                      v-model="form.useStatus"
                      placeholder="状态"
                    >
                      <a-select-option :value="0">未使用</a-select-option>
                      <a-select-option :value="1">使用</a-select-option>
                    </a-select>
                    <span v-else>{{ {0:'未使用',1:'使用'}[form.useStatus] }}</span>
                  </a-form-model-item>
                </td>
                <td>物料代码</td>
                <td>
                  <a-form-model-item prop="materialCode">
                    <a-select
                      v-if="!isDisabled"
                      show-search
                      :value="form.materialCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                      @search="(w) => materialFuzzyAction(w,true)"
                      @change="materialFuzzyHandleChange"
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
                    <span v-else>{{form.materialCode}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>物料名称</td>
                <td>
                  <a-form-model-item>
                    {{form.materialName}}
                  </a-form-model-item>
                </td>
                <td>物料属性</td>
                <td>
                  <a-form-model-item>
                    {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[form.materialProperty]}}
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>辅计量单位</td>
                <td>
                  <a-form-model-item>
                    {{ {1:'支',2:'把',3:'件'}[form.materialUnit] }}
                  </a-form-model-item>
                </td>
                <td>规格型号</td>
                <td>
                  <a-form-model-item>
                    {{form.modelType}}
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>成品率(%)</td>
                <td>
                  <a-form-model-item prop="yield">
                    <a-input-number
                      v-if="!isDisabled"
                      style="width:100%;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-model="form.yield"
                    />
                    <span v-else>{{form.yield}}</span>
                  </a-form-model-item>
                </td>
                <td>工艺路线代码</td>
                <td>
                  <div style="display:flex;">
                  <a-form-model-item prop="routeCode" style="flex:1;">
                    <a-select
                      v-if="!isDisabled"
                      show-search
                      :value="form.routeCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="bomFuzzySearch.fetching ? undefined : '未找到匹配项'"
                      @search="bomFuzzyAction"
                      @change="bomFuzzyHandleChange"
                    >
                      <a-spin
                        v-if="bomFuzzySearch.fetching"
                        slot="notFoundContent"
                        size="small"
                      />
                      <a-select-option
                        v-for="item in bomFuzzySearch.list"
                        :key="item.__key"
                        :value="item.__key"
                      >
                        {{ item.__label }}
                      </a-select-option>
                    </a-select>
                    <span v-else>{{form.routeCode}}</span>



                  </a-form-model-item>
                  <div style="margin-left:10px;">
                    <a-button type="primary" v-if="isAdd" @click="processRouterAction('add')">新增</a-button>
                    <a v-else href="javascript:void(0);" @click="processRouterAction('view')">查看</a>
                  </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>工艺路线名称</td>
                <td>
                  <a-form-model-item>
                    {{form.routeName}}
                  </a-form-model-item>
                </td>
                <td>备注</td>
                <td>
                  <a-form-model-item prop="remark">
                    <a-textarea
                      v-if="!isDisabled"
                      placeholder="备注"
                      :rows="1"
                      v-model="form.remark"
                    />
                    <span v-else>{{form.remark}}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table
              :columns="columnsDetail"
              :dataSource="form.formChildDetailList"
              :pagination="false"
              size="small"
            >
              <div
                slot="order"
                slot-scope="text, record, index"
              >
                {{index + 1}}
              </div>
              <div
                slot="useStatus"
                slot-scope="text, record, index"
              >
                {{ {0:'未使用',1:'使用'}[text] }}
              </div>
              <div
                slot="modelType"
                slot-scope="text, record, index"
              >
                <a-tooltip>
                  <template slot="title">
                    {{text}}
                  </template>
                  <span class="icon-required">查看</span>
                  <a-icon
                    type="question-circle"
                    style="margin-left:5px;color:#1890ff;"
                  />
                </a-tooltip>
              </div>
              <div
                slot="materialProperty"
                slot-scope="text, record, index"
              >
                {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[text] }}
              </div>
              <div
                slot="materialUnit"
                slot-scope="text, record, index"
              >
                {{ {1:'支',2:'把',3:'件'}[text] }}
              </div>
              <div
                slot="isDelete"
                slot-scope="text, record, index"
              >
                {{ {1:'是',0:'否'}[text] }}
              </div>

              <div
                slot="level"
                slot-scope="text, record, index"
              >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.level`"
                  :rules=" {required: true, message: '输入顺序号'}"
                >
                  <a-input
                    v-model="record.level"
                    style="width:100px;"
                    v-if="!isDisabled"
                  />
                  <span v-else>{{record.level}}</span>
                </a-form-model-item>
              </div>

              <div
                slot="researchCode"
                slot-scope="text, record, index"
              >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.researchCode`"
                  :rules=" {required: +record.materialProperty === 1 , message: '输入自研结构件代码'}"
                >
                  <template v-if="!isDisabled">
                    <a-input
                      v-model="record.researchCode"
                      style="width:100px;"
                      v-if="+record.materialProperty === 1"
                    />
                    <span v-else>-</span>
                  </template>
                  <span v-else>{{record.researchCode}}</span>
                </a-form-model-item>
              </div>

              <div
                slot="materialCode"
                slot-scope="text, record, index"
              >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.materialCode`"
                  :rules=" {required: true, message: '请选择物料代码'}"
                >
                  <a-select
                    v-if="!isDisabled"
                    style="width:150px;"
                    show-search
                    :value="record.materialCode"
                    placeholder="模糊搜索"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    @search="(w) => materialFuzzyAction(w,false)"
                    @change="(key) => materialFuzzyTableHandleChange(key,record)"
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
                  <span v-else>{{record.materialCode}}</span>
                </a-form-model-item>
              </div>

              <div
                slot="materialUseStatus"
                slot-scope="text, record, index"
              >
                {{ {0:'未使用',1:'使用'}[text] }}
              </div>


              <div
                slot="materialNum"
                slot-scope="text, record, index"
              >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.materialNum`"
                  :rules=" {required: true, message: '输入用量'}"
                >
                  <a-input-number
                    v-if="!isDisabled"
                    style="width:80px;"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-model="record.materialNum"
                  />
                  <span v-else>{{record.materialNum}}</span>
                </a-form-model-item>
              </div>
              <div
                slot="action"
                slot-scope="text, record, index"
              >
                <a
                  v-if="!isDisabled"
                  href="javascript:void(0);"
                  @click="materialTableAction('del',record)"
                >删除</a>
              </div>
            </a-table>

            <a-button
              v-if="!isDisabled"
              style="width:100%;"
              type="dashed"
              icon="plus"
              @click="materialTableAction('add')"
            >添加</a-button>
          </div>

          <div class="__hd">操作信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">提交人</td>
                <td style="width:350px;">
                  {{form.createdName}}
                </td>
                <td style="width:150px;">
                  提交时间
                </td>
                <td style="width:350px;">
                  {{form.createdTime}}
                </td>
              </tr>
              <tr>
                <td>最后更新人</td>
                <td>{{form.modifierName}}</td>
                <td>最后更新时间</td>
                <td>{{form.modifyTime}}</td>
              </tr>
              <tr>
                <td>审核人</td>
                <td>{{form.auditName}}</td>
                <td>审核时间</td>
                <td>{{form.auditTime}}</td>
              </tr>
              <tr>
                <td>使用人</td>
                <td>{{form.useName}}</td>
                <td>使用时间</td>
                <td>{{form.useTime}}</td>
              </tr>
            </table>
          </div>
        </div>
      </a-form-model>
      <Approval ref="approval" @opinionChange="opinionChange" />
      <ProcessRouteAddForm ref="processRouteAddForm" />
    </a-spin>
  </a-modal>
</template>

<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList ,productMaterialInfoPageList} from '@/api/routineMaterial'
//工艺路线模糊搜索
import { craftRouteApprovePageList } from '@/api/craftRoute'
//工艺路线新增
import ProcessRouteAddForm from '@/views/product-process-management/process-route/module/AddForm'
import { materialFormAddOrUpdate, getMaterialFormDetail,approvalMaterialForm } from '@/api/bomManagement'
import Approval from './ApprovalForm'
import moment from 'moment'

const columnsDetail = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '顺序号',
    dataIndex: 'level',
    scopedSlots: { customRender: 'level' }
  },
  {
    align: 'center',
    title: '自研结构件代码',
    dataIndex: 'researchCode',
    scopedSlots: { customRender: 'researchCode' }
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' }
  },
  {
    align: 'center',
    title: '物料属性',
    dataIndex: 'materialProperty',
    scopedSlots: { customRender: 'materialProperty' }
  },
  {
    align: 'center',
    title: '辅计量单位',
    dataIndex: 'materialUnit',
    scopedSlots: { customRender: 'materialUnit' }
  },
  {
    align: 'center',
    title: '使用状态',
    dataIndex: 'materialUseStatus',
    scopedSlots: { customRender: 'materialUseStatus' }
  },
  {
    align: 'center',
    title: '用量',
    dataIndex: 'materialNum',
    scopedSlots: { customRender: 'materialNum' }
  },
  {
    align: 'center',
    title: '发料仓库',
    dataIndex: 'storeAddress'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

const uuid = () =>
  Math.random()
    .toString(16)
    .slice(2)
export default {
  name: 'bom-management-wrapper',
  provide() {
    return {
      addForm: this
    }
  },
  components: {Approval,ProcessRouteAddForm},
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    this.bomFuzzyAction = this.$_.debounce(this.bomFuzzyAction, 800)
    return {
      columnsDetail,
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      bomFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      form: {
        useStatus:0, //默认未使用
        materialNum: 1, //数量默认 1 不可更改，前端不展示
        yield: 100,
        formChildDetailList: [] //物料信息
      },
      rules: {
        routeName: [{ required: true, message: '请输入工艺路线名称' }],
        defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        materialCode: [{ required: true, message: '请选择物料代码' }]
      }
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : this.isEdit ? '编辑' : this.isCopy ? '复制新增' : '审批'
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isCopy() {
      return this.actionType === 'copy'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit || that.isCopy) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
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
    moment,
    processRouterAction(type){

      let detail = {...this.detail}
      detail.id = this.form.craftId
      this.$refs['processRouteAddForm'].query(type,detail)
    },
    async handleOk() {
      const that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          materialFormAddOrUpdate({ ...that.form }).then(res => {
            console.log(res)
            that.spinning = false
            console.log(res)
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.$emit('finish', { key: that.targetNode.value })
              that.handleCancel()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      const that = this
      that.visible = true
      that.actionType = type
      that.detail = record
      that.targetNode = record.__selectItem
      // debugger
      if (type === 'add') {
        that.form = {
          ...that.form,
          bomGroupName: that.targetNode.title,
          // groupId: that.targetNode.value
          groupId:that.targetNode.__id
        }
      } else{
        const isEdit = type === 'edit'
        const isCopy = type === 'copy'
        that.spinning = true
        getMaterialFormDetail({ id: record.id }).then(res => {
          that.spinning = false
          const data = res.data
          data.formChildDetailList = data.detailListVo.map(item => {
            return Object.assign({}, item, { key: uuid() })
          })
          if (isCopy) {
            let delKeyList = [
              'id','bomCode','createdName','modifierName',
              'createdTime','modifyTime','status','createdId',
              'modifierId','auditName','auditTime',
              'useName','useTime'
            ]

            delKeyList.map(k => delete data[k])
            data.formChildDetailList = data.formChildDetailList.map(item => {
              const _item = Object.assign({}, item)
              delete _item.id
              return _item
            })
          }
          that.form = res.data
        }).catch(err => {
          that.spinning = false
          that.$message.error(err)
        })
      }
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
          item.__key = uuid()
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
    materialFuzzyHandleChange(key) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)
      that.form = {
        ...that.form,
        materialId: target.id,
        materialCode: target.materialCodeFormat,
        materialName: target.materialName,
        materialProperty: target.materialSource,
        materialUnit: target.mainUnit,
        modelType:  'specification' in target  ? (target.specification || target.specifications) : '无'
      }
      console.log(target)
      that.materialFuzzySearch = { ...that.materialFuzzySearch, item: target }
    },
    materialFuzzyTableHandleChange(key, item) {
      // debugger
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)
      const formChildDetailList = [...that.form.formChildDetailList]
      const _target = formChildDetailList.find(itemSelf => itemSelf.key === item.key)

      ;(_target.materialId = target.id),
      (_target.materialCode = target.materialCodeFormat),
      (_target.materialName = target.materialName),
      (_target.materialProperty = target.materialSource),
      (_target.materialUnit = target.mainUnit),
      _target.modelType = 'specification' in target  ? (target.specification || target.specifications) : '无';
      _target.materialUseStatus = target.useStatus
      that.form = { ...that.form, formChildDetailList }
      that.materialFuzzySearch = { list: [], fetching: false, item: target }

      that.$nextTick(() => {
        that.$refs['ruleForm'].validate()
      })
    },
    materialTableAction(type, item) {
      const that = this
      if (type === 'add') {
        const formChildDetailList = [...that.form.formChildDetailList]
        formChildDetailList.push({ key: uuid() })
        that.form = { ...that.form, formChildDetailList }
      } else if (type === 'del') {
        let formChildDetailList = [...that.form.formChildDetailList]
        formChildDetailList = formChildDetailList.filter(itemSelf => itemSelf.key !== item.key)
        that.form = { ...that.form, formChildDetailList }
      }
    },
    async bomFuzzyAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: true }
      const result = await craftRouteApprovePageList({ status: 3 }).then(res => {
        const records = res.data.records.map(item => {
          item.__key = uuid()
          item.__label = `${item.routeCode}(${item.routeName})`
          item.__value = item.routeCode
          item.routeCodeFormat = that.formatMaterialCode(item.routeCode,".")
          return item
        })
        return records
      })
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: false, list: result }
    },
    bomFuzzyHandleChange(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find(item => item.__key === key)
      console.log(target)
      that.form = { ...that.form, craftId: target.id, routeCode: target.routeCode, routeName: target.routeName }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, item: target }
    },
    submitAction(opt) {
      const that = this
      const values = Object.assign({}, opt || {}, { approveId: that.detail.id })
      that.spinning = true
      approvalMaterialForm(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if(+res.code === 200){
            that.handleCancel()
            that.$emit('finish')
          }
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      const that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },
    formatMaterialCode(codeStr,joinSymbol=""){
      if(typeof codeStr !== 'string'){
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,trimRight = /[0]*$/g;
      return codeStr.split('.').map(s => s.replace(trimLeft,'')).join(joinSymbol)
    },
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  line-height: 40px;
}

.bom-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bom-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.card-item {
  margin-bottom: 20px;
}
.__hd {
  font-size: 125%;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>
