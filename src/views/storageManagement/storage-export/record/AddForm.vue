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
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="gift-form-wrapper">
        <div class="card-item">
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">出库单号</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span v-if="form.exWarehouseCode">{{ form.exWarehouseCode }}</span>
                    <span v-else style="color:#bfbfbf;">系统自动生成</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">出库类型</td>
                <td style="width:350px;">
                  <a-form-model-item >
                    <span >{{ {1:'基建出库',2:'研发出库'}[form.exWarehouseType] }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>日期</td>
                <td colspan="3">
                  <a-form-model-item prop="exWarehouseDate">
                    <span>{{ form.date }}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table :columns="columns" :dataSource="form.materialTableList" :pagination="false" size="small">
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>

              <div slot="materialName" slot-scope="text, record">
                <a-popover title="物料信息">
                  <template slot="content">
                    <h3>物料名称</h3>
                    <p style="width:450px;">{{ record.materialName }}</p>
                    <h3>规格型号</h3>
                    <p style="width:450px;">{{ record.specification }}</p>
                    <h3>物料代码</h3>
                    <p style="width:450px;">{{ record.materialCode }}</p>
                  </template>
                  <span>{{ text }}</span>
                </a-popover>
              </div>
              <div slot="alreadyExWarehouseNum" slot-scope="text, record, index">
                <a-form-model-item
                  v-if="!isDisabled"
                  :prop="`materialTableList.${index}.alreadyExWarehouseNum`"
                  :rules="{ required: true, message: '请输入出库数量' }"
                >
                  <a-input-number
                    :disabled="isDisabled"
                    style="width:80px;text-align:center;"
                    :min="0"
                    :max="record.exWarehouseNum"
                    :step="1"
                    :precision="0"
                    :value="record.alreadyExWarehouseNum"
                    @change="(val) => handleExWarehouseNumChange(index,record,val)"
                  />

                  <!-- <a-input-number
                    :disabled="isDisabled"
                    style="width:80px;text-align:center;"
                    :min="0"
                    :max="record.exWarehouseNum"
                    :step="1"
                    :precision="0"
                    :value="record.alreadyExWarehouseNum"
                    @change="(val) => handleExWarehouseNumChange(index,record,val)"
                  /> -->
                </a-form-model-item>
                <span v-else>{{text}}</span>
              </div>
              <div slot="action" slot-scope="text, record">
                <a-button type="link" @click="actionItem('delete', record)">删除</a-button>
              </div>

              <template slot="footer" >
                <div style="text-align:right;margin-right:10px;font-size:16px;">
                  <span>合计：</span>
                  <span style="margin:0 5px;">本次出库数量 &nbsp;{{ form.materialTableList.reduce((adder,item) => adder + (parseFloat(item.alreadyExWarehouseNum) || 0),0)  }} </span>
                </div>
              </template>
            </a-table>
            <!-- <a-button v-if="!isDisabled" style="width: 100%" type="dashed" icon="plus" @click="actionItem('add')"
              >添加</a-button
            > -->
          </div>
          <div class="__hd">备注</div>
          <div class="__bd">
            <a-form-model-item>
              <a-textarea v-if="!isDisabled" :disabled="isDisabled" v-model="form.remarks" placeholder="备注" :rows="4" />
              <span v-else>{{ form.remarks }}</span>
            </a-form-model-item>
          </div>

          <div class="__hd">出库信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">提交人</td>
                <td style="width:350px;">
                  {{form.createdName}}
                </td>
                <td style="width:150px;">提交时间</td>
                <td style="width:350px;">
                  {{form.createdTime}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">出库人</td>
                <td >
                  {{form.userName}}
                </td>
                <td>出库时间</td>
                <td >
                  {{form.exWarehouseTime}}
                </td>
              </tr>
              
            </table>
          </div>

          <div class="__footer">
            <a-button @click="handleSubmit('cancel')">取消</a-button>
            <a-button v-if="isAdd || isEdit" @click="handleSubmit('submit')" type="primary">提交</a-button>
          </div>
        </div>
      </a-form-model>
      
    </a-spin>
  </a-modal>
</template>

<script>
import { 
  getWarehouseList,
  exWarehouseDetail,
  exWarehouseGetMaterial,
  exWarehousePageList,
  exWarehouseRecords,
  exWarehouseStatistics,
  exWarehouseUpdate
} from '@/api/storage_wzz'

import moment from 'moment'


const base_columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '仓位代码',
    dataIndex: 'positionCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '辅计量单位',
    dataIndex: 'subUnit'
  },
  
  {
    title: '出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '未出库数量',
    dataIndex: 'notExWarehouseNum',
  },
  {
    title: '本次出库数量',
    dataIndex: 'alreadyExWarehouseNum',
    scopedSlots: { customRender: 'alreadyExWarehouseNum' }
  },
  
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'stock_management_export_record_addForm',
  components: {
    
  },
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      type: 'view',
      form: {
        exWarehouseType: 1,
        exWarehouseDate: moment(),
        materialTableList: [] //物料信息
      },
      rules: {
        // routeName: [{ required: true, message: '请输入工艺路线名称' }],
        // defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        // materialCode: [{ required: true, message: '请选择物料代码' }]
      },
      instantPositionList: [],
      detail: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    modalTitle() {
      const type = this.record.storageType

      const action = this.isView ? '查看' : this.isEdit ? '编辑' : this.isApproval ? '审批' : '新增'

      return `${action}-出库申请单`
    },
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    columns(){
      let columns = [...base_columns]
      return this.isDisabled ? columns.slice(0,-1) : columns
    }
  },
  methods: {
    moment,
    handleExWarehouseNumChange(index,record,val){
      const that = this
      let materialTableList = [...that.form.materialTableList]
      let target = materialTableList[index]
      target.alreadyExWarehouseNum = val
      target.notExWarehouseNum = (Number(target.exWarehouseNum) || 0) - (Number(target.alreadyExWarehouseNum) || 0)

      that.form = {
        ...that.form,
        materialTableList
      }
    },
    query(type, record) {
      const that = this
      that.visible = true
      that.record = { ...record }
      that.type = type

      exWarehouseDetail({id:that.record.id}).then(res => {
        console.log(res)
        let data = res.data
        that.form = {
          createdName:that.userInfo.trueName,
          createdTime: data.createdTime,
          id:data.id,
          date:data.date,
          exWarehouseCode:data.exWarehouseCode,
          exWarehouseType: 1,
          exWarehouseDate: data.exWarehouseDate,
          materialTableList: data.exWarehouseApplyMaterials || [],
          exWarehouseTime:data.exWarehouseTime,
          userName:data.userName
        }
      })
      

    },
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
        return
      } else if (type === 'submit') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.form,
              exWarehouseApplyMaterials:that.form.materialTableList.map(item => {
                item.notExWarehouseNum = (Number(item.exWarehouseNum) || 0) - (Number(item.alreadyExWarehouseNum) || 0)
                return {...item}
              }),
              exWarehouseDate: that.form.exWarehouseDate || moment().format('YYYY-MM-DD HH:mm:ss')
            }

            delete params.materialTableList
            console.log(params)
            that.spinning = true
            exWarehouseUpdate(params)
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
                console.log(err)
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
  margin-bottom: 0;
}
.custom-table-border caption {
  text-align: left;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
}
.__bd {
  margin-bottom: 10px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
</style>
