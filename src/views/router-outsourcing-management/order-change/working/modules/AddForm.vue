<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="detail" class="gift-form-wrapper">
        <div class="__hd">原工序信息</div>
        <a-table :columns="proColumns" :dataSource="detail.oldCraftList" :pagination="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
        <Parameter :list="detail.oldParameterList || []"></Parameter>

        <div class="__hd" style="margin-top:20px;">工序变更说明</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">工序变更单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.applyCode ? detail.applyCode : '*' }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">关联技改单</td>
            <td style="width:350px;">
              <a-form-model-item v-if="isEdit">
                <a-input placeholder="请输入技改单号" v-model="detail.craftChangeCode"></a-input>
              </a-form-model-item>
              <a-form-model-item v-else>
                <span>{{ detail.craftChangeCode }}</span>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>工序变更说明</td>
            <td colspan="3">
              <a-form-model-item v-if="isEdit">
                <a-input placeholder="请输入工序变更说明" v-model="detail.remark"></a-input>
              </a-form-model-item>
              <a-form-model-item v-else>
                <span>{{ detail.remark }}</span>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">工序变更后成品物料信息</td>
            <td style="width:350px;">
              <a-form-model-item
                v-if="isEdit"
                :prop="`newMaterialCode`"
                :rules="{ required: true, message: '请选择物料' }"
              >
                <MaterialFuzzySearch
                  :materialInfo="{ materialCode: detail.newMaterialCode }"
                  @change="proMaterialChange"
                />
              </a-form-model-item>
              <a-form-model-item v-else>
                <span>{{ detail.newMaterialCode }}</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">原成品物料是否可用</td>
            <td style="width:350px;">
              <a-form-model-item v-if="isEdit">
                <a-switch :checked="detail.oldUseFlag === 1" @change="onChecked" />
              </a-form-model-item>
              <a-form-model-item v-else>
                {{ detail.oldUseFlag === 1 ? '可用' : '不可用' }}
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">工序变更信息</div>
        <div class="__bd">
          <a-table :columns="columns" :dataSource="detail.newCraftList" :pagination="false">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                v-if="isEdit && detail.state === 2"
                :prop="`newCraftList.${index}.materialCode`"
                :rules="{ required: true, message: '请选择物料' }"
              >
                <a-input
                  read-only="read-only"
                  :disable="record.state !== 2"
                  @click="openModel(record, detail.id)"
                  placeholder="请选择物料代码"
                  :value="record.materialCode"
                />
              </a-form-model-item>

              <a-form-model-item v-else>
                {{ text }}
              </a-form-model-item>
            </div>
            <div slot="stateText" slot-scope="text, record">
              <a-form-model-item>
                <span :class="{ newStyle: record.state === 2, replaceStyle: record.state === 3 }">{{ text }}</span>
              </a-form-model-item>
            </div>
            <div slot="action" slot-scope="text, record, index" style="width:80px;" v-if="isEdit">
              <a type="primary" @click="addCraftItem('del', record, index)">删除</a>
            </div>
          </a-table>
          <a-button v-if="isEdit" style="width: 100%" type="dashed" icon="plus" @click="addCraftItem('add')"
            >添加工序</a-button
          >
          <Parameter :list="detail.newParameterList || []" :bEdit="isEdit" @delete="onDel"></Parameter>
          <a-button v-if="isEdit" style="width: 100%" type="dashed" icon="plus" @click="addParameterItem('add')"
            >添加参数</a-button
          >
        </div>
        <!-- 提交人 -->
        <table class="custom-table custom-table-border" v-if="detail.createdName">
          <tr>
            <td>提交人</td>
            <td>{{ detail.createdName }}</td>
            <td>部门</td>
            <td>{{ detail.createdDepartmentName }}</td>
            <td>提交时间</td>
            <td>{{ detail.createdTime }}</td>
          </tr>
        </table>

        <!-- 采购更新报价 -->
        <template v-if="detail.quotationVo">
          <a-divider dashed>采购更新报价</a-divider>
          <Quotation :dataSource="detail.quotationVo" :bEdit="false"></Quotation>
          <table class="custom-table custom-table-border" v-if="detail.createdName">
            <tr>
              <td>提交人</td>
              <td>{{ detail.quotationVo.createdName }}</td>
              <td>部门</td>
              <td>{{ detail.quotationVo.createdDepartmentName }}</td>
              <td>提交时间</td>
              <td>{{ detail.quotationVo.createdTime }}</td>
            </tr>
          </table>
        </template>
        <!-- ////////////// -->
        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="isEdit" @click="handleSubmit('save')" type="primary">保存</a-button>
          <a-button v-if="isEdit" @click="handleSubmit('submit')" type="primary">提交</a-button>

          <a-button type="primary" v-if="isApprove" @click="onApprove(0)" :loading="loading" icon="check"
            >通过</a-button
          >
          <a-button type="primary" v-if="isApprove" @click="onApprove(1)" :loading="loading" icon="close"
            >不通过</a-button
          >
        </div>
      </a-form-model>
      <MaterialSelect ref="materialSelect" v-if="isEdit" @custom-change="handlerMaterialChange" />
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getOrderChangeCraftInfo, craftDetail, craftAdd, craftApprove, getCraftFile } from '@/api/orderChange'
import MaterialSelect from '@/views/storageManagement/storage-export/materialApply/MaterialSelect'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'
import Approval from '@/views/after-sales-management/Accessories/module/Approval.vue'
import Quotation from '../../refuelling/modules/Quotation.vue'
import Parameter from './Parameter.vue'

const renderContent = (text, record, index) => {
  const obj = {
    children: text,
    attrs: {}
  }
  if (index === 0) {
    obj.attrs.rowSpan = record.rowSpan
  } else {
    obj.attrs.rowSpan = 0
  }
  return obj
}

const proColumns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '成品物料名称',
    dataIndex: 'proMaterialName',
    customRender: renderContent
  },
  {
    title: '成品物料代码',
    dataIndex: 'proMaterialCode',
    customRender: renderContent
  },
  {
    title: '成品需求数量',
    dataIndex: 'proNeedCount',
    customRender: renderContent
  },
  {
    title: '工作中心部门',
    dataIndex: 'workshopName'
  },
  {
    title: '工序名',
    dataIndex: 'processName'
  },
  {
    title: '工序代码',
    dataIndex: 'processCode'
  },
  {
    title: '时长（秒）',
    dataIndex: 'duration'
  },
  {
    title: '人工费（元）',
    dataIndex: 'personCost'
  }
]

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '工作中心部门',
    dataIndex: 'workshopName'
  },
  {
    title: '工序名',
    dataIndex: 'processName'
  },
  {
    title: '工序代码',
    dataIndex: 'processCode'
  },
  {
    title: '时长（秒）',
    dataIndex: 'duration'
  },
  {
    title: '人工费（元）',
    width: '150px',
    dataIndex: 'personCost'
  },
  {
    title: '状态',
    width: '150px',
    dataIndex: 'stateText', //变更后的工序相较于之前的工序状态变化：1、原工序 2、新工序 3、被替换
    scopedSlots: { customRender: 'stateText' }
  }
]

export default {
  name: 'outsourcing-order-change-craft-add',
  components: {
    MaterialSelect,
    MaterialFuzzySearch,
    Approval,
    Quotation,
    Parameter
  },
  data() {
    return {
      proColumns,
      columns,
      visible: false,
      spinning: false,
      detail: {
        oldCraftList: [],
        newCraftList: [],
        oldParameterList: [],
        newParameterList: []
      },
      craftList: [], //工序列表
      parameterList: [], //参数列表
      type: 'view',
      loading: false
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : this.isEdit ? (this.type === 'edit' ? '编辑' : '新增') : '审批'
      return `${action}-工序变更单`
    },
    isView() {
      return this.type === 'view'
    },
    isApprove() {
      return this.type === 'approve'
    },
    isEdit() {
      return this.type === 'add' || this.type === 'edit'
    }
  },
  methods: {
    //获取工序和参数列表  //materialType: 1 成品物料 2 常规物料
    getCraftAndParameter(materialId, materialType) {
      const that = this
      getCraftFile({ materialId: materialId, materialType: materialType })
        .then(res => {
          let { fileVoList, routeDetailVo } = res.data
          let { processes } = routeDetailVo
          let craftBoList = processes.map(item => {
            item.key = that.$uuid()
            return item
          })

          let __parameterBoList = []
          fileVoList.map(item => {
            if (Array.isArray(item.fileList)) {
              item.fileList.map(file => {
                __parameterBoList.push({
                  ...item,
                  ...file
                })
              })
            }
          })
          that.parameterList = __parameterBoList
          that.craftList = craftBoList
          console.log('工序列表：', that.craftList)
          console.log('参数列表：', that.parameterList)
        })
        .catch(err => {
          that.parameterList = []
          that.craftList = []
        })
    },
    //选择物料代码
    openModel(record, orderId) {
      this.$refs.materialSelect.query(record, orderId)
    },
    //参数-删除
    onDel(index, record) {
      console.log('删除：', index, record)
      this.detail.newParameterList.splice(index, 1)
    },
    //参数-添加
    addParameterItem(type, record) {
      const that = this
      let newParameterList = [...that.detail.newParameterList]
      if (type === 'add') {
        if (that.detail.newMaterialCode && that.detail.newMaterialId) {
          newParameterList.push({
            key: that._uuid(),
            //测试假数据
            fileUrl:
              'http://linkbin.net/images/cloud/20210624/德澜仕服务号二维码5096c54a-8a4a-46c5-9e7d-87f15873a88a.jpg',
            propertiesDicCode: 'out_store_paremeter_pic',
            propertiesDicId: 952,
            propertiesDicName: '图纸',
            fileName: '文件名称哦哦',
            stateText: '新参数',
            state: 2,
            type: 2
          })
        } else {
          that.$message.warning('请先选择物料')
        }
      } else if (type === 'del') {
        newParameterList = newParameterList.filter(item => item.key !== record.key)
      }
      that.detail = {
        ...that.detail,
        newParameterList
      }
    },
    //工序-添加
    addCraftItem(type, record) {
      const that = this
      let newCraftList = [...that.detail.newCraftList]
      if (type === 'add') {
        if (that.detail.newMaterialCode && that.detail.newMaterialId) {
          newCraftList.push({
            key: that._uuid(),
            //测试假数据
            duration: 7,
            personCost: 7,
            processCode: '下料车间00001',
            processName: 'LED组件安装',
            processId: 38,
            workshopId: 9,
            workshopName: '下料车间',
            stateText: '新工序',
            type: 2,
            state: 2
          })
        } else {
          that.$message.warning('请先选择物料')
        }
      } else if (type === 'del') {
        newCraftList = newCraftList.filter(item => item.key !== record.key)
      }
      that.detail = {
        ...that.detail,
        newCraftList
      }
    },
    //type:view/del/edit
    async query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.detail = { ...record }
      //操作按钮的控制
      var bHaveOP = that.columns.some(function(item) {
        if (item.title === '操作') {
          return true
        }
      })
      if (!this.isEdit && bHaveOP) {
        that.columns.pop()
      }
      if (this.isEdit && !bHaveOP) {
        that.columns.push({
          align: 'center',
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        })
      }

      if (type !== 'add' && this.detail) {
        //工序变更单-查看详情
        craftDetail({ id: this.detail.id }).then(res => {
          if (res.code === 200) {
            const { oldMaterialName, oldMaterialId, oldMaterialCode, needCount } = res.data
            var detail = { ...that.detail, ...res.data }
            detail.oldCraftList = res.data.oldCraftList.map((item, index) => {
              item.key = index + 1
              item.proMaterialName = oldMaterialName
              item.proMaterialId = oldMaterialId
              item.proMaterialCode = oldMaterialCode
              item.proNeedCount = needCount
              item.stateText = { 1: '原工序', 2: '新工序', 3: '被替换' }[item.state] || '未知' //1、原工序 2、新工序 3、被替换
              item.type = 1 //新增时候的标示 原数据：1 原 2、新
              return item
            })
            const len = detail.oldCraftList.length
            if (len > 0) {
              detail.oldCraftList[0].rowSpan = len //表格行合并
            }
            let newCraftList = res.data.newCraftList.map((item, index) => {
              item.key = index + 1
              item.proNeedCount = needCount
              item.stateText = { 1: '原工序', 2: '新工序', 3: '被替换' }[item.state] || '未知'
              item.type = 2 //新增时候的标示 原数据：1 原 2、新
              return item
            })
            detail.oldParameterList = detail.oldParameterList.map((item, index) => {
              item.type = 1
              return item
            })
            let  newParameterList = detail.newParameterList.map((item, index) => {
              item.type = 2
              return item
            })
            //编辑的时候，需剔除被替换的数据
            if (type === 'edit') {
              detail.newCraftList = newCraftList.filter(item => item.state !== 3)
              detail.newParameterList = newParameterList.filter(item => item.state !== 3)
            } else {
              detail.newCraftList = newCraftList
              detail .newParameterList = newParameterList
            }
            
            //变更报价
            if (res.data.quotationVo) {
              detail.quotationVo.materialVoList = res.data.quotationVo.materialVoList.map((item, index) => {
                item.key = index + 1
                item.stateText = { 1: '原物料', 2: '新物料', 3: '被替换' }[item.state] || '未知'
                item.typeText = { 1: '原料', 2: '模具' }[item.type] || '未知' //类型(1:原料,2:模具)
                return item
              })
              detail.quotationVo.sendTakeVoList = res.data.quotationVo.sendTakeVoList.map((item, index) => {
                item.key = index + 1
                item.payTypeText = { 1: '是', 2: '否' }[item.payType] || '未知' //是否需要付费(1:是,2:否)
                item.typeText = { 1: '原料送取', 2: '成品送取' }[item.type] || '未知' //类型(1:原料送取,2:成品送取)
                item.providerText = { 1: '委托方送货', 2: '加工商提货' }[item.provider] || '未知' //提供者(1:委托方提供,2:加工商送货）
                item.materialName = { 1: '全部原料', 2: '成品' }[item.type] || '未知' //写死 原料送取为‘全部原料’ 成品为‘成品’
                return item
              })
            }
            that.detail = detail
            console.log('工序变更单详情：', that.detail)
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        getOrderChangeCraftInfo({ oderId: this.detail.orderId }).then(res => {
          if (res.code === 200) {
            const {
              materialName,
              materialId,
              materialCode,
              needCount,
              specification,
              subUnit,
              type
            } = res.data.changeMaterialNewstVo.finishMaterial
            let oldCraftList = res.data.changeCraftList.map((item, index) => {
              item.key = index + 1
              item.proMaterialName = materialName
              item.proMaterialId = materialId
              item.proMaterialCode = materialCode
              item.proNeedCount = needCount
              item.stateText = '原工序'
              item.type = 1 //新增时候的标示 原材料类型：//1、原工序 2、新工序 3、被替换
              return item
            })
            const len = oldCraftList.length
            if (len > 0) {
              oldCraftList[0].rowSpan = len //表格行合并
            }
            const parameterList = res.data.changeParameterList.map((item, index) => {
              item.key = index + 1
              item.state = 1 //1、原工序 2、新工序 3、被替换
              item.type = 1
              return item
            })
            that.detail = {
              ...that.detail,
              craftChangeCode: '', //关联技改单编号
              craftChangeId: 1, //测试-写死
              remark: '', //换料说明
              needCount, //所需数量
              oldMaterialCode: materialCode,
              oldMaterialId: materialId,
              oldMaterialName: materialName,
              oldSpecification: specification,
              oldSubUnit: subUnit,
              oldType: type,
              oldCraftList: oldCraftList,
              oldUseFlag: 1,
              newCraftList: JSON.parse(JSON.stringify(oldCraftList)).map(item => {
                item.type = 1
                item.state = 1 //1、原工序 2、新工序 3、被替换
                return item
              }),
              oldParameterList: parameterList,
              newParameterList: JSON.parse(JSON.stringify(parameterList)).map(item => {
                item.type = 2
                item.state = 1 //1、原参数 2、新参数 3、被替换
                return item
              })
            }
          } else {
            that.$message.error(res.msg)
          }
        })
      }
    },

    // 原料选择
    handlerMaterialChange({ selectItem, recordParam }) {
      console.log('原料选取：', selectItem)
      const {
        exitApplyNum, //原材料已出库申请数量
        // needCount, //所需数量
        remainExitApplyNum, //原材料剩余已出库申请数量
        sendType, //原材料送取类型(1:委托方提货,2:加工商送货)
        materialId,
        materialName, //物料名称
        materialCode, //物料代码
        specification, //规格型号
        subUnit, //辅计量单位
        // type, //类型(1:原料,2:模具)
        createdId,
        createdTime
      } = selectItem

      const exWarehouseMaterialList = [...this.detail.oldCraftList]
      // 物料信息列表中已存在该物料，无需重新添加，直接调整原记录即可
      var temp = exWarehouseMaterialList.find(element => element.materialCode === materialCode)
      if (temp) {
        this.$message.warning('物料代码为【' + materialCode + '】的记录已存在')
      } else {
        const item = exWarehouseMaterialList.find(obj => obj.key === recordParam.key)
        item.createdId = createdId
        item.createdTime = createdTime
        item.materialCode = materialCode
        item.materialId = materialId
        item.materialName = materialName
        item.sendType = sendType
        item.specification = specification
        item.subUnit = subUnit
        item.realityExWarehouseNum = exitApplyNum //实际出库数量
        item.notExWarehouseNum = remainExitApplyNum //未出库数量
        item.exWarehouseNum = remainExitApplyNum //待出库数量
        item.sendTypeText = { 1: '委托方送货', 2: '加工商提货' }[sendType] || '未知'
        this.detail = {
          ...this.detail,
          exWarehouseMaterialList
        }
      }
    },
    //换料后成品物品信息
    proMaterialChange(item) {
      console.log('换料后成品物品信息-item:', item)
      const { materialCode, materialId, materialName, modelType, materialUnit, type } = item
      this.detail.newMaterialCode = materialCode //更换后的物料代码
      this.detail.newMaterialId = materialId //更换后的物料id
      this.detail.newMaterialName = materialName //更换后的物料名称
      this.detail.newSpecification = modelType //更换后规格型号
      this.detail.newSubUnit = materialUnit //更换后的辅助计量单位
      this.detail.newType = type //新成品物料类型：1 成品物料 2 常规物料
      // this.getCraftAndParameter(materialId,type)
      //测试用 materiallId:31 materialType:1
      this.detail.newMaterialId = 31 //更换后的物料id
      this.detail.newType = 1 //新成品物料类型：1 成品物料 2 常规物料
      this.getCraftAndParameter(this.detail.newMaterialId, this.detail.newType)
      //更换物料信息后-删除原来新增的工序和参数
      // this.detail.newCraftList = this.detail.newCraftList.filter(item => item.type == 1)
      // this.detail.newParameterList = this.detail.newParameterList.filter(item => item.type == 1)
    },

    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
      } else if (type === 'submit' || type === 'save') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.detail,
              craftDetailBoList: that.detail.newCraftList.concat(that.detail.oldCraftList), //老的新的都要上传 老的type:1 新的type:2
              parameterDetailCraftBoList: that.detail.newParameterList.concat(that.detail.oldParameterList),
              operationFlag: type === 'submit' ? 2 : 1 //操作类型: 1 保存 2 提交审核
            }
            delete params.newCraftList
            delete params.oldCraftList
            delete params.newParameterList
            delete params.oldParameterList
            console.log('新增参数：', params)
            that.spinning = true
            craftAdd(params)
              .then(res => {
                that.spinning = false
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.$emit('ok')
                  that.handleCancel()
                }
              })
              .catch(err => {
                that.spinning = false
                that.$message.error(err.message)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },

    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    },
    //原成品物料是否可用
    onChecked(e) {
      console.log('原成品物料是否可用:', e)
      this.detail.oldUseFlag = e ? 1 : 0
    },
    opinionChange(opinion) {
      this.submitApprove(1, opinion)
    },
    submitApprove(isAdopt, opinion) {
      var that = this
      this.loading = true
      craftApprove({ isAdopt, approveId: this.detail.id, opinion })
        .then(res => {
          that.loading = false
          if (res.code === 200) {
            that.$message.success(res.msg)
            that.$emit('ok')
            that.handleCancel()
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch(() => (that.loading = false))
    },
    //审批通过 isAdopt:审批结果：0通过 1不通过;approveId:业务id;opinion:审批意见
    onApprove(isAdopt) {
      if (isAdopt === 0) {
        this.submitApprove(isAdopt, '')
      } else {
        //审批不通过-需填写审批意见
        this.$refs.approval.query()
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border {
  margin-top: 16px;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
  margin-bottom: 10px;
}
.__bd {
  margin-top: 5px;
  margin-bottom: 10px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
.newStyle {
  color: green;
}
.replaceStyle {
  color: red;
}
</style>
