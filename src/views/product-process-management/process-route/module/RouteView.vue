<template>
    <a-spin :spinning="spinning">
      <div class="route-view-wrapper">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="product-process-management_process-route-management_route-wrapper"
      >
        <div class="card-item">
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">工艺路线代码</td>
                <td style="width:350px;">
                  <a-form-model-item prop="routeCode">
                    <a-input
                      v-if="!isDisabled"
                      style="width:100%;"
                      :disabled="true"
                      placeholder="系统自动生成"
                      v-model="form.routeCode"
                    />
                    <span v-else>{{form.routeCode}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">工艺路线名称</td>
                <td style="width:350px;">
                  <a-form-model-item prop="routeName">
                    <a-input
                      v-if="!isDisabled"
                      style="width:100%;"
                      :disabled="!isAdd"
                      placeholder="工艺路线名称"
                      v-model="form.routeName"
                    />
                    <span v-else>{{form.routeName}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>工艺路线组别名称</td>
                <td>
                  <a-form-model-item prop="materialGroupCode">
                    <a-input
                      v-if="!isDisabled"
                      style="width:100%;"
                      :disabled="true"
                      placeholder="自动生成"
                      v-model="form.materialGroupCode"
                    />
                    <span v-else>{{form.materialGroupCode}}</span>
                  </a-form-model-item>
                </td>
                <td>物料代码</td>
                <td>
                  <a-form-model-item prop="materialCode">
                    <a-select
                      v-if="!isDisabled"
                      :disabled="!isAdd"
                      show-search
                      :value="materialInfo.materialCodeFormat"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="materiaFetching ? undefined : null"
                      @search="darkSearch"
                      @change="materialValueHandleChange"
                    >
                      <a-spin
                        v-if="materiaFetching"
                        slot="notFoundContent"
                        size="small"
                      />
                      <a-select-option
                        v-for="d in materialValueList"
                        :key="d.key"
                        :value="d.materialCodeFormat"
                      >
                        {{ d.materialName }}
                      </a-select-option>
                    </a-select>
                    <span v-else>{{materialInfo.materialCodeFormat}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>物料名称</td>
                <td>
                  <a-form-model-item>
                    {{materialInfo.materialName}}
                  </a-form-model-item>
                </td>
                <td>规格型号</td>
                <td>
                  <a-form-model-item>
                    {{materialInfo.specifications}}
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>主计量单位</td>
                <td>
                  <a-form-model-item>
                    {{ {1:'支',2:'把',3:'件'}[materialInfo.mainUnit] || materialInfo.mainUnit }}
                  </a-form-model-item>
                </td>
                <td>缺省状态</td>
                <td>
                  <a-form-model-item prop="defaultStatus">
                    <a-select
                      v-if="!isDisabled"
                      :disabled="!isAdd"
                      v-model="form.defaultStatus"
                      placeholder="缺省状态"
                    >
                      <a-select-option :value="1">是</a-select-option>
                      <a-select-option :value="0">否</a-select-option>
                    </a-select>
                    <span v-else>{{ {1:'是',0:'否'}[form.defaultStatus] }}</span>
                  </a-form-model-item>
                </td>
              </tr>

            </table>
          </div>
        </div>
        <div class="card-item">
          <div class="__hd">工序信息</div>
          <div class="__bd">
            <div style="display:flex;line-height:40px;">
              <span>工序</span>
              <a-form-model-item
                v-if="!isDisabled"
                style="margin:0 10px;"
              >
                <a-select
                  placeholder="车间"
                  @change="allWorkshopHandlerChange"
                  style="width:200px"
                  v-model="form.workshopId"
                >
                  <a-select-option
                    v-for="item in allWorkshop"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{item.departmentName}}({{item.workshopNum}})
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item v-if="!isDisabled">
                <a-select
                  placeholder="工序"
                  mode="multiple"
                  style="width:200px"
                  v-model="form.processList"
                  @change="processListHandlerChange"
                >
                  <a-select-option
                    v-for="item in processByWorkshop"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{item.processName}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div v-if="!isDisabled">
              工序列表(上下拖拽可调整顺序)
            </div>
            <table class="custom-table custom-table-border">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>工作中心部门</th>
                  <th>工序名</th>
                  <th>工序代码</th>
                  <th>检验方式</th>
                  <th>是否外协</th>
                  <th>时长(秒)</th>
                  <th>人工费(元)</th>
                  <th v-if="!isDisabled"><a
                      href="javascript:void(0);"
                      @click="processTableDataChange('clear')"
                    >清空</a></th>
                </tr>

              </thead>

              <vuedraggable
                tag="tbody"
                class="process_main_wrapper"
                v-if="form.processes.length > 0"
                ghost-class="ghost"
                v-model="form.processes"
                @end="dragEndHandler"
              >
                <tr
                  v-for="(item,idx) in form.processes"
                  :key="item.id"
                >
                  <td>{{item.orderNum}}</td>
                  <td>{{item.departmentName}}</td>
                  <td>{{item.processName}}</td>
                  <td>{{item.processCode}}</td>
                  <td>
                    <!--checkType -->
                    <a-select
                      v-if="!isDisabled"
                      :disabled="isDisabled"
                      placeholder="检验方式"
                      style="widtd:120px"
                      :defaultValue="2"
                      v-model="item.checkType"
                    >
                      <a-select-option :value="1">免检</a-select-option>
                      <a-select-option :value="2">抽检</a-select-option>
                      <a-select-option :value="3">全检</a-select-option>
                    </a-select>
                    <span v-else>
                      {{ {1:'免检',2:'抽检',3:'全检'}[item.checkType] }}
                    </span>
                  </td>
                  <td>
                    <!-- foreignFlag -->
                    <a-select
                      v-if="!isDisabled"
                      :disabled="isDisabled"
                      placeholder="是否外协"
                      style="widtd:80px"
                      :defaultValue="0"
                      v-model="item.foreignFlag"
                    >
                      <a-select-option :value="1">是</a-select-option>
                      <a-select-option :value="0">否</a-select-option>
                    </a-select>
                    <span v-else>
                      {{ {1:'是',0:'否'}[item.foreignFlag] }}
                    </span>
                  </td>
                  <td>
                    <a-form-model-item
                      :prop="'processes.' + idx + '.duration'"
                      :rules="{
                      required: true,
                      message: '请输入时长',
                      trigger: 'blur',
                    }"
                    >
                      <a-input-number
                        v-if="!isDisabled"
                        :disabled="isDisabled"
                        style="width:120px;"
                        :min="0"
                        :step="1"
                        :precision="0"
                        v-model="item.duration"
                      />
                      <span v-else>{{item.duration}}</span>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item
                      :prop="'processes.' + idx + '.personCost'"
                      :rules="{
                      required: true,
                      message: '请输入人工费',
                      trigger: 'blur',
                    }"
                    >
                      <a-input-number
                        v-if="!isDisabled"
                        :disabled="isDisabled"
                        style="width:120px;"
                        :min="0"
                        :step="1"
                        :precision="2"
                        v-model="item.personCost"
                      />
                      <span v-else>{{item.personCost | moneyFormatNumber}}</span>
                    </a-form-model-item>
                  </td>
                  <td v-if="!isDisabled">
                    <a
                      href="javascript:void(0);"
                      @click="processTableDataChange('del',item)"
                    >删除</a>
                  </td>
                </tr>
              </vuedraggable>

            </table>
            <div style="margin-top:10px;">参数配置</div>
            <table class="custom-table custom-table-border">
              <tr>
                <td>工时</td>
                <td>
                  <a
                    href="javascript:void(0);"
                    @click="() => openModel('configRules')"
                  >操作规程</a>
                </td>
                <td>
                  <a
                    href="javascript:void(0);"
                    @click="() => openModel('drawData',{type:0})"
                  >图纸</a>
                </td>
              </tr>
              <tr>
                <td>
                  <a
                    href="javascript:void(0);"
                    @click="() => openModel('drawData',{type:1})"
                  >排版图</a>
                </td>
                <td>
                  <a
                    href="javascript:void(0);"
                    @click="() => openModel('drawData',{type:2})"
                  >程序</a>
                </td>
                <td>检验标准</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="card-item">
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
                <td>
                  {{ [3,4].includes(+form.status) ? '审核人员' : '最后更新人' }}
                </td>
                <td>{{form.modifierName}}</td>
                <td>{{ [3,4].includes(+form.status) ? '审核时间' : '最后更新时间' }}</td>
                <td>{{form.modifyTime}}</td>
              </tr>
            </table>
          </div>
        </div>

      </a-form-model>
      </div>
      <ConfigRules
        ref="configRules"
        @change="configRulesHandler"
      />
      <DrawData
        ref="drawData"
        @change="drawDataHandler"
      />
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
</template>

<script>
import { routineMaterialInfoPageList } from '@/api/routineMaterial'

import {
  craftRouteGetCode,
  craftRouteGetAllWorkshop,
  craftRouteGetProcessByWorkshop,
  craftRouteAdd,
  craftRouteUpdate,
  craftRouteDetail,
  craftRouteApprove,
  craftRouteGetDeviceFile,
  craftRouteProcessDelete
} from '@/api/craftRoute'
import vuedraggable from 'vuedraggable'
import ConfigRules from './ConfigRules'
import DrawData from './DrawData'

import moment from 'moment'
import UploadFile from './UploadFile'
import DepartmentPostCascade from '@/components/CustomerList/DepartmentPostCascade'
import ApprovalForm from './ApprovalForm'
let uuid = () => Math.random().toString(16).slice(2);
//this.$_.debounce(this.onChange, 2000)
export default {
  name: 'product-process-management_process-route-management_route-addForm',
  provide(){
    return {
      addForm:this
    }
  },
  components: {
    DepartmentPostCascade,
    UploadFile,
    vuedraggable,
    ConfigRules,
    DrawData,
    Approval: ApprovalForm
  },
  data() {
    this.darkSearch = this.$_.debounce(this.darkSearch, 800)
    return {
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
      materialValue: '',
      materialValueList: [],
      materiaFetching: false,
      materialInfo: {},
      form: {
        processes: [],
        processList: []
      },
      rules: {
        routeName: [{ required: true, message: '请输入工艺路线名称' }],
        defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        materialCode: [{ required: true, message: '请选择物料代码' }]
      },
      DepartmentPostValue: null,
      uploadConfig: {
        maxFileCount: 1,
        fileType: 'img',
        enablePreview: true
      },
      targetNode: {},

      allWorkshop: [],
      workshop: [],
      processByWorkshop: [],
      processTableData: []
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : this.isEdit ? '编辑' : '审批'
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
      } else if (that.isAdd || that.isEdit) {
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
    processListHandlerChange(arr) {
      const that = this
      const workshop = that.allWorkshop.find(item => String(item.id) === String(that.form.workshopId))

      let _processes = [...that.form.processes]
      let _add = [],_del = []; //这里只有新增和删除 2种情况

      arr.map(id => {
        if(!_processes.find(p => p.processId === id)){
          _add.push(id)
        }
      })
      _processes.map(p => {
        if(!arr.includes(p.processId)){
          _del.push(p.processId)
        }
      })
      _add.map(id => {
        let item = that.processByWorkshop.find(item => item.id === id)
        _processes.push({
          ...item,
          orderNum:_processes.length + 1,
          departmentName:workshop.departmentName,
          processCode:item.processNum,
          processId:item.id,
          checkType:item.checkType || 2,
          foreignFlag:item.foreignFlag || 0
        })
      });
      _processes = _processes.filter(p => !_del.includes(p.processId))
      that.form = { ...that.form, processes:_processes }
    },
    dragEndHandler(e) {
      if (this.isDisabled) {
        return
      }
      if (e && e.type === 'end') {
        this.$nextTick(() => this.reSortAction())
      }
    },
    reSortAction() {
      // const _processTableData = this.processTableData.map(p => Object.assign({}, p))
      // this.processTableData = _processTableData.map((p, index) => {
      //   p.orderNum = index + 1
      //   return p
      // })

      let processes = [...this.form.processes]

      processes.map((item,idx) => {
        item.orderNum = idx + 1
        return item
      })

      this.form = {
        ...this.form,
        processes
      }

    },
    async processTableDataChange(field, record, val) {
      const that = this
      if (field === 'clear') {
        that.form = { ...that.form, processes: [], processList: [] }
      } else if (field === 'del') {

        await craftRouteProcessDelete(record.id).then(res => {
          console.log(res)
        })

        let { processes, processList } = that.form
        processes = processes.filter(item => item.processId !== record.processId)
        processList = processes.map(item => item.processId)
        that.form = { ...that.form, processes, processList }
      }
    },
    materialValueHandleChange(value) {
      const that = this
      const target = that.materialValueList.find(item => item.materialCodeFormat === value)
      that.materialInfo = { ...target }
      that.form = {
        ...that.form,
        materialCommonId: that.materialInfo.id,
        materialCommonCaculatorUnit: that.materialInfo.mainUnit,
        materialCode: that.materialInfo.materialCodeFormat,

        materialCommonCode: that.materialInfo.materialCodeFormat,
        materialCommonName: that.materialInfo.materialName,
        materialCommonType: that.materialInfo.specifications
      }
      Object.assign(that, {
        materialValueList: [],
        materiaFetching: false
      })
    },
    async handleOk() {
      const that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      const { deviceId, processes, picFiles, rangeProcesses } = that.form
      if (processes && processes.length === 0) {
        that.$message.info('请选择工序')
        return
      }
      if (!deviceId) {
        that.$message.info('请选择操作规程')
        return
      }
      if (!picFiles || (Array.isArray(picFiles) && picFiles.length === 0)) {
        that.$message.info('请上传图纸')
        return
      }
      if (!picFiles || (Array.isArray(rangeProcesses) && !rangeProcesses.some(f => f.fileType === 1))) {
        that.$message.info('请上传排版图')
        return
      }
      if (!picFiles || (Array.isArray(rangeProcesses) && !rangeProcesses.some(f => f.fileType === 2))) {
        that.$message.info('请上传程序')
        return
      }

      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const api = that.isAdd ? craftRouteAdd : craftRouteUpdate
          that.spinning = true
          api({ ...that.form })
            .then(res => {
              that.spinning = false
              console.log(res)
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish', { key: that.targetNode.value })
                that.handleCancel()
              }
            })
            .catch(err => {
              that.$message.error(err)
              console.log(err)
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
    formatMaterialCode(codeStr,joinSymbol=""){
      if(typeof codeStr !== 'string'){
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,trimRight = /[0]*$/g;
      return codeStr.split('.').map(s => s.replace(trimLeft,'')).join(joinSymbol)
    },
    async query(type, record = {}) {
      const that = this
      that.visible = true
      that.actionType = type
      that.detail = record
      that.targetNode = record.__selectItem
      await craftRouteGetAllWorkshop().then(res => {
        that.allWorkshop = res.data
      })
      if (that.isAdd) {
        that.spinning = true
        await craftRouteGetCode().then(res => {
          that.spinning = true
          that.form = {
            ...that.form,
            routeCode: res.data,
            materialGroupId: that.targetNode.__id,
            materialCommonCaculatorUnit: that.targetNode.__mainUnit,
            materialGroupCode: that.targetNode.__materialCode
          }
        }).catch(err => {
          that.spinning = false
          that.$message.info(err)
        })
        return
      }
      if (that.isEdit || that.isView || that.isApproval) {
        that.spinning = true
        await craftRouteDetail({ id: that.detail.id })
          .then(async res => {
            that.spinning = false
            console.log(res)
            const { processes } = res.data
            let workshopId = null
            if (processes.length > 0) {
              workshopId = processes[0].workshopId
            }
            const workshop = that.allWorkshop.find(item => item.id === workshopId)
            await craftRouteGetProcessByWorkshop({ workshopId: workshopId }).then(res => {
              that.processByWorkshop = res.data
            })

            that.form = {
              ...res.data,
              workshopId,
              processList: processes.map(item => +item.processId),
              processes: processes.map(item => {
                item.departmentName = workshop.departmentName
                return item
              }).sort((a,b) => a.orderNum - b.orderNum),
              materialCode: res.data.materialCommonCode,
              materialCodeFormat:res.data.materialCommonCode
            }

            that.materialInfo = {
              id: that.form.materialCommonId,
              mainUnit: that.form.materialCommonCaculatorUnit,
              materialCode: that.form.materialCommonCode,
              materialName: that.form.materialCommonName,
              specifications: that.form.materialCommonType,
              materialCode: that.form.materialCommonCode,
              materialCodeFormat:that.form.materialCommonCode
            }
          })
          .catch(err => {
            that.spinning = false
            that.$message.info(err)
          })
        return
      }
      if (that.isCopy) {
        that.spinning = true
        const routeCode = await craftRouteGetCode().then(res => res.data)
        await craftRouteDetail({ id: that.detail.id })
          .then(async res => {
            that.spinning = false
            console.log(res)
            const { processes } = res.data
            let workshopId = null
            if (processes.length > 0) {
              workshopId = processes[0].workshopId
            }
            const workshop = that.allWorkshop.find(item => item.id === workshopId)
            await craftRouteGetProcessByWorkshop({ workshopId: workshopId }).then(res => {
              that.processByWorkshop = res.data
            })

            const parms = {
              ...res.data,
              workshopId,
              processList: processes.map(item => +item.processId),
              processes: processes.map(item => {
                item.departmentName = workshop.departmentName
                return item
              }),
              materialCode: res.data.materialCommonCode,
              materialCodeFormat:res.data.materialCommonCode,
              routeCode
            }

            parms.picFiles = parms.picFiles.map(item => {
              const _item = Object.assign({}, item)
              delete _item.id
              return _item
            })
            parms.rangeProcesses = parms.rangeProcesses.map(item => {
              const _item = Object.assign({}, item)
              delete _item.id
              return _item
            })
            parms.processes = parms.processes.map(item => {
              const _item = Object.assign({}, item)
              delete _item.id
              return _item
            })
            that.form = parms
            that.materialInfo = {
              id: parms.materialCommonId,
              mainUnit: parms.materialCommonCaculatorUnit,
              materialCode: parms.materialCommonCode,
              materialCodeFormat:parms.materialCommonCode,
              materialName: parms.materialCommonName,
              specifications: parms.materialCommonType
            }
          })
          .catch(err => {
            that.spinning = false
            that.$message.info(err)
          })
        that.actionType = 'add'
        return
      }

      if (that.isView) {
      }
    },
    allWorkshopHandlerChange(e) {
      const that = this
      craftRouteGetProcessByWorkshop({ workshopId: e }).then(res => {
        that.processByWorkshop = res.data
        that.form = {
          ...that.form,
          processes: [],
          processList: []
        }
      })
    },
    async darkSearch(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.materiaFetching = true
      const result = await routineMaterialInfoPageList(_searchParam).then(res => {
        if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
          return []
        }
        return res.data.records.map((item, index) => {
          item.key = uuid()
          item.materialCodeFormat = that.formatMaterialCode(item.materialCode,".")
          item.specifications = item.specification || `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
          return item
        })
      })
      that.materialValueList = result
      that.materiaFetching = false
    },
    openModel(refName, params = {}) {
      this.$refs[refName].query(params, { ...this.form })
    },
    configRulesHandler(data) {
      this.form = {
        ...this.form,
        deviceId: data.id
      }
    },
    drawDataHandler(data) {
      const that = this
      if (!data) {
        return
      }
      if ('rangeProcesses' in data) {
        if (data.rangeProcesses.find(item => +item.fileType === 1)) {
          const rangeProcesses = that.form.rangeProcesses || []
          that.form.rangeProcesses = [...rangeProcesses.filter(item => +item.fileType !== 1), ...data.rangeProcesses]
        } else {
          const rangeProcesses = that.form.rangeProcesses || []
          that.form.rangeProcesses = [...rangeProcesses.filter(item => +item.fileType !== 2), ...data.rangeProcesses]
        }
      }
      if ('picFiles' in data) {
        this.form = { ...this.form, ...data }
      }
    },
    submitAction(opt) {
      const that = this
      const values = Object.assign({}, opt || {}, { approveId: that.detail.id })
      that.spinning = true
      craftRouteApprove(values)
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
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  line-height: 40px;
}

.product-process-management_process-route-management_route-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.product-process-management_process-route-management_route-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.route-view-wrapper{
  background-color: #f5f5f5;
  padding: 20px;
}
.card-item {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.__hd {
  font-size: 100%;
  font-weight: bold;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>
