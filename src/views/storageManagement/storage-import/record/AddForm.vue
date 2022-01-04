<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
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
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="stock_management_import_record-wrapper">
        <div class="card-item">
          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table :columns="columns" :dataSource="form.materialTableList" :pagination="false" size="small">
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>
              <div slot="storageNum" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="`materialTableList.${index}.storageNum`"
                  :rules="{ required: true, message: '请输入库数量' }"
                >
                  <a-input-number
                    style="width:80px;text-align:center;"
                    :min="0"
                    :step="1"
                    :precision="0"
                    v-model="record.storageNum"
                  />
                </a-form-model-item>
              </div>

              <template slot="footer" >
                <div style="text-align:right;margin-right:10px;font-size:16px;">
                  <span>合计：</span>
                  <span style="margin:0 5px;">应入库数量 &nbsp;{{ form.materialTableList.reduce((adder,item) => adder + (parseFloat(item.actualNum) || 0),0)  }} </span>
                  <span>本次入库数量 &nbsp;{{ form.materialTableList.reduce((adder,item) => adder + (parseFloat(item.storageNum) || 0),0) }}</span>
                </div>
              </template>
            </a-table>
          </div>
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">入库仓库/库区</td>
                <td colspan="3">
                  <a-row :gutter="20">
                    <a-col :span="6">
                      <a-form-model-item prop="warehouseId">
                        <a-select style="width:100%;" placeholder="选择仓库" v-model="form.warehouseId" @change="handleWarehouseChange">
                          <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
                            item.warehouseName
                          }}</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>

                    <a-col :span="6">
                      <a-form-model-item prop="reservoirAreaId">
                        <a-select 
                          style="width:100%;"
                          placeholder="选择库区" 
                          v-model="form.reservoirAreaId" 
                          @change="handleReservoirAreaChange"
                        >
                          <a-select-option v-for="item in reservoiList" :key="item.id" :value="item.id">{{
                            item.reservoirName
                          }}</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>

                    <a-col :span="6">
                      <a-form-model-item prop="shelvesLocationId">
                        <a-select 
                          style="width:100%;"
                          placeholder="选择货架" 
                          v-model="form.shelvesLocationId" 
                          @change="handleShelvesLocationChange"
                        >
                          <a-select-option v-for="item in shelvesLocationList" :key="item.shelvesLocationId" :value="item.shelvesLocationId">{{
                            item.shelvesLocationName
                          }}</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>

                    <a-col :span="6">
                      <a-form-model-item prop="positionId">
                        <a-select
                          :disabled="isDisabled"
                          v-model="form.positionId"
                          placeholder="选择仓位"
                          style="width:100%;"
                          @change="handlePositionChange"
                        >
                          <a-select-option v-for="item in instantPositionList" :key="item.id" :value="item.id">{{
                            item.positionCode
                          }}</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </td>
              </tr>
              <tr>
                <td>容器/托盘代码</td>
                <td colspan="3">
                  <a-form-model-item prop="containerId">
                    <a-select
                      v-model="form.containerId"
                      placeholder="选择容器/托盘"
                      style="width:100%;"
                      @change="handleContainerPalletChange"
                    >
                      <a-select-option v-for="item in containerPalletList" :key="item.id" :value="item.id">
                        {{ `${item.palletName}-(${item.palletCode})-${+item.palletStatus === 0 ? '闲置' : '使用'}` }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>制单员</td>
                <td>{{form.makerName || '-'}}</td>
                <td>制单时间</td>
                <td>{{form.makerDate || '-' }}</td>
              </tr>
              <tr>
                <td>入库员</td>
                <td>{{form.storageUserName || '-'}}</td>
                <td>入库时间</td>
                <td>{{form.storageTime || '-'}}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button type="primary" @click="handleSubmit('submit')">提交</a-button>

          <a-popover title="物料入库码" trigger="click" placement="top" >
            <a slot="content" id="ant-popover-qrcode">
              <div :style="{width:qrSize+'px',height:qrSize+'px'}">
                <vue-qr :text="qrText" :size="qrSize" />
              </div>
            </a>
            <a-button type="primary" @click="handleSubmit('qrcode')">
              打印物料入库码
            </a-button>
          </a-popover>

          <!-- <a-button type="primary" @click="handleSubmit('qrcode')">打印物料入库码</a-button> -->

          
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '入库类型',
    dataIndex: 'storageTypeText'
  },
  {
    title: '入库单号',
    dataIndex: 'storageCode'
  },
  {
    title: '紧急程度',
    dataIndex: 'urgentTypeText'
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '应入库数量',
    dataIndex: 'actualNum'
  },
  {
    title: '产品重量',
    dataIndex: 'weight'
  },
  {
    title: '本次入库数量',
    dataIndex: 'storageNum',
    scopedSlots: { customRender: 'storageNum' }
  }
]
import VueQr from 'vue-qr'
import util from '@/components/_util/util'
import { getList, ReservoiGetList } from '@/api/storage'

import { getShelvesByAreaId, containerPalletList } from '@/api/storage_wzz'

import { 
  storageDetail,
  storageRecords,
  storageStatistics,
  storageSingleUpdate,
  storageBatchUpdate
} from '@/api/storage_wzz'

export default {
  name: 'stock_management_import_record_addForm',
  components:{
    VueQr
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      visible: false,
      spinning: false,
      type: 'view',
      columns,
      form: {
        materialTableList: [] //物料信息
      },
      rules: {
        warehouseId: [{ required: true, message: '请选择仓库' ,trigger: 'change'}],
        reservoirAreaId: [{ required: true, message: '请选择库区' ,trigger: 'change'}],
        shelvesLocationId: [{ required: true, message: '请选择货架' ,trigger: 'change'}],
        positionId: [{ required: true, message: '请选择仓位' ,trigger: 'change'}],
        containerId: [{ required: true, message: '请选择容器/托盘' ,trigger: 'change'}],
      },
      warehouseList: [],
      reservoiList: [],
      shelvesLocationList: [],
      instantPositionList: [],
      containerPalletList: [],
      qrText: '',
      qrSize: 200,
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '入库记录' : '入库'
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
    }
  },
  methods: {
    async query(type, records = []) {
      const that = this
      that.form = {
        materialTableList: [] //物料信息
      }
      that.warehouseList = []
      that.reservoiList = []
      that.shelvesLocationList = []
      that.instantPositionList = []
      that.containerPalletList = []

      that.visible = true
      that.form.materialTableList = that.$_.cloneDeep(records.map(item => {
        item.storageNum = item.notNum
        return item
      }))
      that.type = type

      getList().then(res => {
        that.warehouseList = res.data
      })
      
      storageDetail({id:records[0].id}).then(res => {
        console.log(res)
        const data = res.data
        that.form = {
          ...that.form,
          makerName:data.makerName,
          makerDate:data.makerDate,
          storageUserName:data.storageUserName || that.userInfo.trueName,
          storageTime:data.storageTime
        }
      })
    },

    handleSubmit(type) {
      const that = this
      if(type === 'cancel'){
        that.handleCancel()
        return
      }
      if(type === 'qrcode'){
        
        that.$nextTick(() => {
          const {materialTableList} = that.form
          if(materialTableList.length > 0){
            that.qrText = materialTableList[0].storageCode

            if(that.qrText.length > 0){
              setTimeout(function(){
                util.handleWindowPrint(`#ant-popover-qrcode`, '物料入库码')
              },500)
            }
          }else{
            that.qrText = ''
          }
        })

        
        
        return
      }
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          let storageUpdateBos = []
          let params = {...that.form}
          let materialTableList = params.materialTableList
          delete params.materialTableList
          materialTableList.map(item => {
            storageUpdateBos.push({
              ...params,
              notNum:item.notNum,
              storageNum:item.storageNum,
              id:item.id
            })
          })

          storageBatchUpdate({
            storageUpdateBos
          }).then(res => {
            that.$message.success(res.msg)
            if(res.code === 200){
              that.handleCancel()
              that.$emit('ok')
            }
            console.log(res)
          }).catch(err => {
            that.$message.error(err.message)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      // that.handleCancel()
    },
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    },

    handleWarehouseChange(id) {
      const that = this
      let target = that.warehouseList.find(item => item.id === id)
      that.form = {
        ...that.form,
        warehouseId: id,
        warehouseName: target.warehouseName
      }

      that.$nextTick(() => {
        ReservoiGetList({ warehouseId: id }).then(res => {
          that.reservoiList = res.data
        })
      })
    },

    handleReservoirAreaChange(id) {
      const that = this
      let target = that.reservoiList.find(item => item.id === id)
      that.form = {
        ...that.form,
        reservoirAreaId: id,
        reservoirCode: target.reservoirCode,
        reservoirAreaName: target.reservoirName
      }

      that.$nextTick(() => {
        const { reservoirAreaId , materialTableList} = that.form
        const materialId = materialTableList[0].materialId
        getShelvesByAreaId({
          areaId: reservoirAreaId,
          materialId
        }).then(res => {
          that.shelvesLocationList = res.data.map(item => {
            item.key = that._uuid()
            return item
          })
        })
      })
    },

    handleShelvesLocationChange(shelvesLocationId) {
      const that = this
      let target = that.shelvesLocationList.find(item => item.shelvesLocationId === shelvesLocationId)
      if (target) {
        that.instantPositionList = target.positionModelVoList || []

        that.form = {
          ...that.form,
          shelvesLocationId: target.shelvesLocationId,
          shelvesLocationName: target.shelvesLocationName,
          shelvesLocationType: target.type
        }
      }
    },

    handlePositionChange(id) {
      const that = this
      let target = that.instantPositionList.find(item => item.id === id)
      that.form = {
        ...that.form,
        positionId: id,
        positionCode: target.positionCode
      }

      containerPalletList({palletCodeOne:target.positionCode}).then(res => {
        that.containerPalletList = (res.data || [])
      })
    },

    handleContainerPalletChange(id) {
      let target = this.containerPalletList.find(item => item.id === id)
      this.form = {
        ...this.form,
        containerId: id,
        containerName: target.palletName
      }
    }
  }
}
</script>

<style scoped>
.stock_management_import_record-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

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
