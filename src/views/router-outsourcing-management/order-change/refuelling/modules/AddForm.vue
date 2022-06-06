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
        <div class="__hd">原成品物料信息</div>
        <a-table :columns="proColumns" :dataSource="detail.oldSourceList" :pagination="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>

        <div class="__hd" style="margin-top:20px;">换料说明</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">换料单号</td>
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
            <td>换料说明</td>
            <td colspan="3">
              <a-form-model-item v-if="isEdit">
                <a-input placeholder="请输入换料说明" v-model="detail.remark"></a-input>
              </a-form-model-item>
              <a-form-model-item v-else>
                <span>{{ detail.remark }}</span>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">换料后成品物料信息</td>
            <td style="width:350px;">
              <a-form-model-item v-if="isEdit">
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

        <div class="__hd">原材料信息</div>
        <div class="__bd">
          <a-table :columns="columns" :dataSource="detail.newSourceList" :pagination="false">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                v-if="isEdit && detail.state === 2"
                :prop="`newSourceList.${index}.materialCode`"
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
            <div slot="needCount" slot-scope="text, record, index">
              <a-form-model-item
                v-if="isEdit && record.state === 2"
                :prop="`newSourceList.${index}.needCount`"
                :rules="{ required: true, message: '请输入单个加工原料量' }"
              >
                <a-input-number
                  style="width:80px;"
                  :min="1"
                  :max="record.notExWarehouseNum"
                  :step="1"
                  :precision="0"
                  :value="record.needCount"
                  @change="val => handleNumChange(index, record, val)"
                />
              </a-form-model-item>
              <a-form-model-item v-else>
                {{ record.needCount }}
              </a-form-model-item>
            </div>
            <div slot="stateText" slot-scope="text, record">
              <a-form-model-item>
                <span :class="{ newStyle: record.state === 2, replaceStyle: record.state === 3 }">{{ text }}</span>
              </a-form-model-item>
            </div>
            <div slot="action" slot-scope="text, record, index" style="width:80px;" v-if="isEdit">
              <a type="primary" @click="doItemAction('del', record, index)">删除</a>
            </div>
          </a-table>
          <a-button v-if="isEdit" style="width: 100%" type="dashed" icon="plus" @click="actionItem('add')"
            >添加</a-button
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
import { getOrderChangeInfo, refuellingDetail, refuellingAdd, refuellingApprove } from '@/api/orderChange'
import MaterialSelect from '@/views/storageManagement/storage-export/materialApply/MaterialSelect'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'
import Approval from '@/views/after-sales-management/Accessories/module/Approval.vue'
import Quotation from './Quotation.vue'

const renderContent = (text,record,index) => {
  // $attrs：当前组件的属性，通俗的讲也就是在组件标签定义的一系列属性，如input的value，placeholder等，但是不包括在当前组件里面定义的props属性
  // $props：当前组件从父组件那里接收的参数，通俗的讲和$attr差不多，但是只包括在当前组件中定义了的props属性。
  // $data：Vue 实例观察的数据对象。Vue 实例代理了对其 data 对象 property 的访问。
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
    title: '原料名称',
    dataIndex: 'materialName'
  },
  {
    title: '原料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '原料规格型号',
    dataIndex: 'specification'
  },
  {
    title: '原料单位（辅单位）',
    dataIndex: 'subUnit'
  },
  {
    title: '单个加工原料量',
    dataIndex: 'needCount'
  },
  {
    title: '所需原料总量', //所需总量=单个使用原料数量(needCount)*成品物料数量(finishMaterial.needCount)
    dataIndex: 'needCountSum'
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
    title: '原料名称',
    dataIndex: 'materialName'
  },
  {
    title: '原料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '原料规格型号',
    dataIndex: 'specification'
  },
  {
    title: '原料单位（辅单位）',
    dataIndex: 'subUnit'
  },
  {
    title: '单个加工原料量',
    dataIndex: 'needCount',
    scopedSlots: { customRender: 'needCount' }
  },
  {
    title: '所需原料总量', //所需总量=单个使用原料数量(needCount)*成品物料数量(finishMaterial.needCount)
    dataIndex: 'needCountSum'
  },
  {
    title: '状态',
    width: '80px',
    dataIndex: 'stateText',
    scopedSlots: { customRender: 'stateText' }
  }
]

export default {
  name: 'outsourcing-order-change-refuelling-add',
  components: {
    MaterialSelect,
    MaterialFuzzySearch,
    Approval,
    Quotation
  },
  data() {
    return {
      proColumns,
      columns,
      visible: false,
      spinning: false,
      detail: {
        oldSourceList: [],
        newSourceList: []
      },
      type: 'view',
      loading: false
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : this.isEdit ? (this.type === 'edit' ? '编辑' : '新增') : '审批'
      return `${action}-换料申请单`
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
    //选择物料代码
    openModel(record, orderId) {
      this.$refs.materialSelect.query(record, orderId)
    },
    //单个加工原料量改变
    handleNumChange(index, record, val) {
      console.log('改变>>>', val, record.proNeedCount)
      const that = this
      const newSourceList = [...that.detail.newSourceList]
      const target = newSourceList[index]
      target.needCount = val
      target.needCountSum = +val * record.proNeedCount
      console.log('总计>>>', target.needCountSum)
      console.log('sum:', this.detail.newSourceList[index].needCountSum)
      this.detail.newSourceList = newSourceList
      // if (+val > +record.notExWarehouseNum) {
      //   that.$message.warning(`单个加工原料量已大于原材料剩余数量(${record.notExWarehouseNum})`)
      // }
    },
    //物料信息-添加
    actionItem(type, record) {
      const that = this
      let newSourceList = [...that.detail.newSourceList]
      if (type === 'add') {
        newSourceList.push({
          key: that._uuid(),
          //测试假数据
          materialCode: '8.3.1.27',
          materialId: 4040,
          materialName: '哈哈',
          needCount: 10,
          needCountSum: 500,
          orderId: 1,
          specification: ' uuuuuuu',
          subUnit: '台',
          proNeedCount: 55,
          stateText: '新物料',
          type: 2,
          state: 2
        })
      } else if (type === 'delete') {
        newSourceList = newSourceList.filter(item => item.key !== record.key)
      }
      that.detail = {
        ...that.detail,
        newSourceList
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
        //换料申请单-查看详情
        refuellingDetail({ id: this.detail.id }).then(res => {
          if (res.code === 200) {
            const { oldMaterialName, oldMaterialId, oldMaterialCode, needCount } = res.data
            var detail = { ...that.detail, ...res.data }
            detail.oldSourceList = res.data.oldSourceList.map((item, index) => {
              item.key = index + 1
              item.needCountSum = item.needCount * needCount
              item.proMaterialName = oldMaterialName
              item.proMaterialId = oldMaterialId
              item.proMaterialCode = oldMaterialCode
              item.proNeedCount = needCount
              item.stateText = { 1: '原物料', 2: '新物料', 3: '被替换' }[item.state] || '未知' //1、原物料 2、新物料 3、被替换
              item.type = 1 //新增时候的标示 原材料类型：1 原需求单材料 2、新增材料
              return item
            })

            const len = detail.oldSourceList.length
            if(len > 0){
              detail.oldSourceList[0].rowSpan = len //表格行合并
            } 

            let newSourceList = res.data.newSourceList.map((item, index) => {
              item.key = index + 1
              item.proNeedCount = needCount
              item.needCountSum = item.needCount * needCount
              item.stateText = { 1: '原物料', 2: '新物料', 3: '被替换' }[item.state] || '未知'
              item.type = 2 //新增时候的标示 原材料类型：1 原需求单材料 2、新增材料
              return item
            })
            //编辑的时候，需剔除被替换的数据
            if (type === 'edit') {
              detail.newSourceList = newSourceList.filter(item => item.state !== 3)
            } else {
              detail.newSourceList = newSourceList
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
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        getOrderChangeInfo({ oderId: this.detail.orderId }).then(res => {
          if (res.code === 200) {
            const {
              materialName,
              materialId,
              materialCode,
              needCount,
              specification,
              subUnit,
              type
            } = res.data.finishMaterial
            const oldSourceList = res.data.partMaterialList.map((item, index) => {
              item.key = index + 1
              item.needCountSum = item.needCount * needCount
              item.proMaterialName = materialName
              item.proMaterialId = materialId
              item.proMaterialCode = materialCode
              item.proNeedCount = needCount
              item.stateText = '原物料'
              item.type = 1 //新增时候的标示 原材料类型：//1、原物料 2、新物料 3、被替换
              return item
            })
            const len = oldSourceList.length
            if(len > 0){
              oldSourceList[0].rowSpan = len //表格行合并
            }
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
              oldSourceList: oldSourceList,
              oldUseFlag: 1,
              newSourceList: JSON.parse(JSON.stringify(oldSourceList)).map(item => {
                item.type = 2
                item.state = 1 //1、原物料 2、新物料 3、被替换
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

      const exWarehouseMaterialList = [...this.detail.oldSourceList]
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
              detailBoList: that.detail.newSourceList.concat(that.detail.oldSourceList), //老的新的都要上传
              operationFlag: type === 'submit' ? 2 : 1 //操作类型: 1 保存 2 提交审核
            }
            delete params.newSourceList
            delete params.oldSourceList
            console.log('新增参数：', params)
            that.spinning = true
            refuellingAdd(params)
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
    //原料删除
    doItemAction(type, record, index) {
      if (type === 'del') {
        this.detail.newSourceList.splice(index, 1)
      }
    },
    opinionChange(opinion) {
      this.submitApprove(1, opinion)
    },
    submitApprove(isAdopt, opinion) {
      var that = this
      this.loading = true
      refuellingApprove({ isAdopt, approveId: this.detail.id, opinion })
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
