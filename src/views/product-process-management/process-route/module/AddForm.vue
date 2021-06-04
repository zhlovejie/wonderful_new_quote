<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
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
                    style="width:100%;"
                    :disabled="true"
                    placeholder="系统自动生成"
                    v-model="form.routeCode"
                  />
                </a-form-model-item>
              </td>
              <td style="width:150px;">工艺路线名称</td>
              <td style="width:350px;">
                <a-form-model-item prop="routeName">
                  <a-input
                    style="width:100%;"
                    :disabled="isDisabled"
                    placeholder="工艺路线名称"
                    v-model="form.routeName"
                  />
                </a-form-model-item>
              </td>
            </tr>
            <tr>
              <td>工艺路线组别名称</td>
              <td>
                <a-form-model-item prop="materialGroupCode">
                  <a-input
                    style="width:100%;"
                    :disabled="true"
                    placeholder="自动生成"
                    v-model="form.materialGroupCode"
                  />
                </a-form-model-item>
              </td>
              <td>物料代码</td>
              <td>
                <a-form-model-item prop="materialCode">
                  <a-select
                    show-search
                    :value="materialInfo.materialCode"
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
                      :key="d.id"
                      :value="d.materialCode"
                    >
                      {{ d.materialName }}
                    </a-select-option>
                  </a-select>

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
                  {{ {1:'支',2:'把',3:'件'}[materialInfo.mainUnit] }}
                </a-form-model-item>
              </td>
              <td>缺省状态</td>
              <td>
                <a-form-model-item prop="defaultStatus">
                  <a-select
                    v-model="form.defaultStatus"
                    placeholder="缺省状态"
                  >
                    <a-select-option :value="1">是</a-select-option>
                    <a-select-option :value="0">否</a-select-option>
                  </a-select>
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
            <a-form-model-item style="margin:0 10px;">
              <a-select
                placeholder="车间"
                @change="allWorkshopHandlerChange"
                style="width:200px"
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

            <a-form-model-item>
              <a-select
                placeholder="工序"
                mode="multiple"
                style="width:200px"
                v-model="processList"
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
          <div>
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
                <th><a
                    href="javascript:void(0);"
                    @click="processTableDataChange('clear')"
                  >清空</a></th>
              </tr>

            </thead>

            <vuedraggable
              tag="tbody"
              class="process_main_wrapper"
              v-if="processTableData.length > 0"
              ghost-class="ghost"
              v-model="processTableData"
              @end="dragEndHandler"
            >
              <tr
                v-for="(item,idx) in processTableData"
                :key="item.id"
              >
                <td>{{item.serialNum}}</td>
                <td>{{workshop.departmentName}}</td>
                <td>{{item.processName}}</td>
                <td>{{item.processNum}}</td>
                <td>
                  <!--checkType -->
                  <a-form-model-item
                    :prop="'domains.' + idx + '.value'"
                    :rules="{
                      required: true,
                      message: 'domain can not be null',
                      trigger: 'blur',
                    }"
                  >
                  <a-select
                    placeholder="检验方式"
                    style="widtd:120px"
                    :defaultValue="2"
                    :value="item.checkType"
                    @change="(e) => processTableDataChange('checkType',item.id,e)"
                  >
                    <a-select-option :value="1">免检</a-select-option>
                    <a-select-option :value="2">抽检</a-select-option>
                    <a-select-option :value="3">全检</a-select-option>
                  </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <!-- foreignFlag -->
                  <a-select
                    placeholder="是否外协"
                    style="widtd:80px"
                    :defaultValue="0"
                    :value="item.foreignFlag"
                    @change="(e) => processTableDataChange('foreignFlag',item.id,e)"
                  >
                    <a-select-option :value="1">是</a-select-option>
                    <a-select-option :value="0">否</a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-input-number
                    style="width:120px;"
                    :min="0"
                    :step="1"
                    :precision="0"
                    :value="item.duration"
                    @change="(e) => processTableDataChange('duration',item.id,e)"
                  />
                </td>
                <td>
                  <a-input-number
                    style="width:120px;"
                    :min="0"
                    :step="1"
                    :precision="2"
                    :value="item.personCost"
                    @change="(e) => processTableDataChange('personCost',item.id,e)"
                  />
                </td>
                <td>
                  <a
                    href="javascript:void(0);"
                    @click="processTableDataChange('del',item.id)"
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
                <a href="javascript:void(0);" @click="() => openModel('configRules')">操作规程</a>
              </td>
              <td>
                <a href="javascript:void(0);" @click="() => openModel('drawData',{type:0})">图纸</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="javascript:void(0);" @click="() => openModel('drawData',{type:1})">排版图</a>
              </td>
              <td>
                <a href="javascript:void(0);" @click="() => openModel('drawData',{type:2})">程序</a>
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

              </td>
              <td style="width:150px;">
                提交时间
              </td>
              <td style="width:350px;">

              </td>
            </tr>
            <tr>
              <td>
                最后更新人
              </td>
              <td>

              </td>
              <td>最后更新时间</td>
              <td></td>
            </tr>
            <tr>
              <td>
                审核人员
              </td>
              <td>

              </td>
              <td>审核时间</td>
              <td></td>
            </tr>
          </table>
        </div>
        </div>

      </a-form-model>
      <ConfigRules ref="configRules" @change="configRulesHandler"/>
      <DrawData ref="drawData" @change="drawDataHandler"/>
    </a-spin>
  </a-modal>
</template>

<script>
import { addAndUpdateMeetingLeave, approvalMeetingLeave, getMeetingLeaveDetail } from '@/api/meetingManagement'

import { routineMaterialInfoPageList } from '@/api/routineMaterial'

import { craftRouteGetCode, craftRouteGetAllWorkshop, craftRouteGetProcessByWorkshop } from '@/api/craftRoute'
import vuedraggable from 'vuedraggable'
import ConfigRules from './ConfigRules'
import DrawData from './DrawData'

import moment from 'moment'
import UploadFile from './UploadFile'
import DepartmentPostCascade from '@/components/CustomerList/DepartmentPostCascade'
//this.$_.debounce(this.onChange, 2000)
export default {
  name: 'product-process-management_process-route-management_route-addForm',
  components: {
    DepartmentPostCascade,
    UploadFile,
    vuedraggable,
    ConfigRules,
    DrawData
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
      },
      rules: {
        routeName: [{ required: true, message: '请输入工艺路线名称' }],
        defaultStatus:[{ required: true, message: '请选择缺省状态' }],
        materialCode:[{ required: true, message: '请选择物料代码' }],
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
      processList: [],
      processTableData: [],
    }
  },
  watch: {
    processList(val) {
      let { processByWorkshop } = this
      this.processTableData = val
        .map(id => processByWorkshop.find(item => item.id === id))
        .map((item, idx) => {
          item.serialNum = idx + 1
          if (!item.checkType) {
            item.checkType = 2
          }
          if (!item.foreignFlag) {
            item.foreignFlag = 0
          }
          return item
        })
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '编辑'
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
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
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
    dragEndHandler(e) {
      if (e && e.type === 'end') {
        this.$nextTick(() => this.reSortAction())
      }
    },
    reSortAction() {
      let _processTableData = this.processTableData.map(p => Object.assign({}, p))
      this.processTableData = _processTableData.map((p, index) => {
        p.serialNum = index + 1
        return p
      })
    },
    processTableDataChange(field, key, val) {
      let processTableData = [...this.processTableData]
      if (field === 'clear') {
        this.processTableData = []
        this.processList = []
      } else if (field === 'del') {
        this.processTableData = processTableData.filter(item => item.id !== key)
        this.processList = processTableData.map(item => item.id)
      } else {
        let target = processTableData.find(item => item.id === key)
        if (target) {
          target[field] = val
        }
        this.processTableData = processTableData
      }
    },
    materialValueHandleChange(value) {
      debugger
      let target = this.materialValueList.find(item => item.materialCode === value)
      this.materialInfo = { ...target }
      this.form = {
        ...this.form,
        materialCommonId:this.materialInfo.materialCode,
        materialCommonCaculatorUnit:this.materialInfo.mainUnit,
        materialCode:this.materialInfo.materialCode,
      }
      Object.assign(this, {
        materialValueList: [],
        materiaFetching: false
      })
    },
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.targetNode = record.__selectItem
      if (that.isAdd) {
        await craftRouteGetCode().then(res => {
          that.form = {
            ...that.form,
            routeCode: res.data,
            materialGroupCode: that.targetNode.materialCode,
            materialCommonCaculatorUnit:that.targetNode.materialCode
          }
        })

        await craftRouteGetAllWorkshop().then(res => {
          that.allWorkshop = res.data
        })

        //workshopId
      }
      return
    },
    allWorkshopHandlerChange(e) {
      const that = this

      that.workshop = that.allWorkshop.find(item => String(item.id) === String(e))
      craftRouteGetProcessByWorkshop({ workshopId: e }).then(res => {
        that.processByWorkshop = res.data
        that.processList = []
      })
    },
    async darkSearch(wd) {
      const that = this
      let _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.materiaFetching = true
      let result = await routineMaterialInfoPageList(_searchParam).then(res => {
        if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
          return []
        }
        return res.data.records.map((item, index) => {
          item.key = index + 1
          item.specifications = `
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
    openModel(refName,params ={}){
      this.$refs[refName].query(params)
    },
    configRulesHandler(data){
      debugger
      this.form = {
        ...this.form,
        deviceId:data.id
      }
    },
    drawDataHandler(data){
      this.form = {
        ...this.form,
        ...data
      }
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

.card-item{
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
