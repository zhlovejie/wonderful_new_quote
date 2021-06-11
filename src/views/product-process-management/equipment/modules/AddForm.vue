<template>
  <a-modal
    :title="modalTitle"
    :width="1300"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <!-- 基本数据 -->
    <BasicInformation ref="basicInformation" @file="receive" />
    <!-- 设备操作规程 -->
    <EquipmentOperation ref="equipmentOperation" />
    <!-- 保养资料 -->
    <Maintain ref="maintain" @file="maintains" />
    <!-- 保养操作规程 -->
    <MaintenanceProcedures ref="maintenanceProcedures" />
    <!-- 安全事项 -->
    <Security ref="security" @file="securitys" />
    <!-- 售后服务 -->
    <AfterSaleService ref="afterSaleService" @file="afterSaleServices" />
    <!-- 常备耗材 -->
    <StandingConsumables ref="standingConsumables" />
  </a-modal>
</template>

<script>
import { pageDevesaveOrUpdate, pageDevesaveCraftDev } from '@/api/ProcessManagement'
import BasicInformation from './basicInformation'
import EquipmentOperation from './equipmentOperation'
import Maintain from './maintain'
import MaintenanceProcedures from './maintenanceProcedures'
import Security from './security'
import AfterSaleService from './afterSaleService'
import StandingConsumables from './standingConsumables'

export default {
  name: 'product-process-management_mould-management-addForm',
  components: {
    BasicInformation,
    EquipmentOperation,
    Maintain,
    MaintenanceProcedures,
    Security,
    AfterSaleService,
    StandingConsumables,
  },
  data() {
    return {
      // refs: ['basicInformation'],
      detail: {},
      basicInformation: undefined,
      security: undefined,
      maintain: undefined,
      afterSaleService: undefined,
      visible: false,
      actionType: 'view',
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
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      }
      return btn
    },
  },
  methods: {
    receive(data) {
      this.basicInformation = data
    },
    securitys(data) {
      this.security = data
    },
    maintains(data) {
      this.maintain = data
    },
    afterSaleServices(data) {
      this.afterSaleService = data
    },

    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      that.$refs.basicInformation.handleOk()
      //保养资料
      that.$refs.maintain.handleOk()
      //安全事项
      that.$refs.security.handleOk()
      //售后服务
      that.$refs.afterSaleService.handleOk()

      // let valuer = that.$refs.basicInformation.hendle()
      // let security = that.$refs.security.hendle()
      // let maintain = that.$refs.maintain.hendle()
      // let afterSaleService = that.$refs.afterSaleService.hendle()
      //设备操作规程
      let equipment = that.$refs.equipmentOperation.handleOk()
      let equipmentData = that.$refs.equipmentOperation.handleData()
      //保养操作规程
      let maintenance = that.$refs.maintenanceProcedures.handleOk()
      let maintenanceData = that.$refs.maintenanceProcedures.handleData()
      //常备耗材
      let standingConsumables = that.$refs.standingConsumables.handleOk()
      let standingConsumablesData = that.$refs.standingConsumables.handleData()
      if (equipment.length === 0) {
        return that.$message.error('请上传设备操作规程')
      }
      if (maintenance.length === 0) {
        return that.$message.error('请上传保养操作规程')
      }
      if (standingConsumables.length === 0) {
        return that.$message.error('请上传常备耗材')
      }

      let basic = { ...that.basicInformation }
      if (that.isEdit) {
        basic.id = that.detail.id
        basic.deleteIds = [...equipmentData, ...maintenanceData, ...standingConsumablesData]
      }
      basic.developmentCraftDevCares = that.maintain

      basic.developmentCraftDevSafeItems = that.security

      basic.developmentCraftDevPostServices = that.afterSaleService
      basic.equipmentOperations = equipment
      basic.maintenanceOperations = maintenance
      basic.standingConsumables = standingConsumables

      console.log(basic)

      if (that.basicInformation && that.security && that.maintain && that.afterSaleService) {
        pageDevesaveOrUpdate(basic)
          .then((res) => {
            that.spinning = false
            that.visible = false
            that.$message.info(res.msg)
            that.$emit('finish')
          })
          .catch((err) => (that.spinning = false))
      }
    },
    handleCancel() {
      // this.fileList = []
      // this.form.resetFields() // 清空表
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.record = record
      if (!that.isAdd) {
        await pageDevesaveCraftDev({ id: record.id }).then((res) => {
          that.detail = res.data
        })
        //   that.detail = res.data
        //   let arr = (res.data.picsUrl || '').split(',')
        //   ;(this.fileList = arr.map((item) => {
        //     return {
        //       uid: uuid(),
        //       url: item,
        //       status: 'done',
        //       name: '1',
        //     }
        //   })),
      }
      this.$nextTick(() => {
        that.$refs.basicInformation.query(type, that.detail)
        that.$refs.equipmentOperation.query(type, that.detail)
        that.$refs.maintenanceProcedures.query(type, that.detail)
        that.$refs.maintain.query(type, that.detail)
        that.$refs.security.query(type, that.detail)
        that.$refs.afterSaleService.query(type, that.detail)
        that.$refs.standingConsumables.query(type, that.detail)
        // that.$refs.standingConsumables.query(type, record)
      })
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.product-process-management_mould-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.product-process-management_mould-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
