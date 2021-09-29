<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">保存</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>任务单编号</td>
            <td>{{ record.taskNum }}</td>
            <td>客户名称</td>
            <td>{{ record.customerName }}</td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>选择产品名称</td>
            <td>主板号</td>
            <td>{{ record.orgName }}</td>
          </tr>
        </table>
        <h3 style="margin-top: 15px">配件清单</h3>
        <table class="custom-table custom-table-border" v-for="(item, index) in opinionData" :key="item.index">
          <a-button type="primary" style="margin-bottom: 15px; margin-top: 15px" shape="round">
            主板号：{{ item.mainBoardNo }}
          </a-button>
          <a-button v-if="false" type="link" @click="problemdel(index)">删除 </a-button>
        </table>
        <h3>收件人信息</h3>
        <table class="custom-table custom-table-border"></table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  listUserByAfterSale,
  networkManagementList,
  handleTaskDocument,
  taskDocumentDetail,
} from '@/api/after-sales-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import { getAreaByParent } from '@/api/common'
export default {
  name: 'BecomingForm',

  data() {
    return {
      opinionData: [],
      birthplaceOptions: [], //籍贯 级联 省市
      labelName: undefined,
      record: {},
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      spinning: false,
      type: 'add',
      userInfo: this.$store.getters.userInfo,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isVeiw ? '详情' : '修改'
      return `${txt}`
    },
    isAdd() {
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isVeiw
    },
  },

  created() {},
  methods: {
    SelectChange(value) {
      let arr = this.AfterSale.find((i) => i.id === value)
      this.mobile = arr.userInfo.mobile || ''
    },
    async query(type, record) {
      this.visible = true
      this.fileList = []
      this.fileList1 = []
      this.type = type
      this.record = record
      let _areaData = await this.loadAreaAction(100000)
      this.birthplaceOptions = _areaData

      listUserByAfterSale().then((res) => (this.AfterSale = res.data))
      networkManagementList().then(
        (res) =>
          (this.options = res.data.map((i) => {
            return {
              networkName: i.networkName,
              id: i.id,
              serviceUserVoList: i.serviceUserVoList.map((u) => {
                return {
                  networkName: `${u.serviceUserName}(${u.contactInformation})`,
                  id: `${u.serviceUserName}(${u.contactInformation})`,
                }
              }),
            }
          }))
      )

      this.fillData()
      if (type !== 'handle' && record.serviceMode === 1) {
        let that = this
        if (record.province) {
          let _arr = record.province.split(',')
          _arr = _arr.map((v) => parseInt(v, 10))
          let _areaCityData = await that.loadAreaAction(_arr[0])
          let ctiyTargetOption = that.birthplaceOptions.find((p) => p.value == _arr[0])
          if (ctiyTargetOption) {
            ctiyTargetOption.children = _areaCityData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }

          let _areaAreaData = await that.loadAreaAction(_arr[1])
          let areaTargetOption = ctiyTargetOption.children.find((p) => p.value == _arr[1])
          if (areaTargetOption) {
            areaTargetOption.children = _areaAreaData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }
          that.$nextTick(() => that.form.setFieldsValue({ territory: _arr }))
        }
      }
    },

    problemdel(i) {
      this.opinionData.splice(i, 1)
    },

    handleCustomerSelected(item) {
      this.saleuserShow = item.saleUserId !== 0 && item.saleUserId !== null ? true : false
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
        saleUserId:
          item && item.saleUserId && item.saleUserId !== 0 && item.saleUserId !== null ? item.saleUserId : undefined,
      })
    },
    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      taskDocumentDetail(id).then((res) => {
        that.recordDetails = res.data
        this.opinionData = res.data.deviceInfoVoList.map((item) => {
          return {
            picture: item.photo.split(',').map((i) => {
              return {
                uid: uuid(),
                name: i.substr(0, 300),
                status: 'done',
                url: i,
              }
            }),
            createdName: item.createdName,
            deviceLocation: item.deviceLocation,
            isWarranty: item.isWarranty,
            mainBoardNo: item.mainBoardNo,
            orgId: item.orgId,
            orgName: item.orgName,
            photo: item.photo,
            problemDescription: item.problemDescription,
            productName: item.productName,
            quantity: item.quantity,
            remark: item.remark,
            video: item.video,
            villageId: item.villageId,
            villageName: item.villageName,
          }
        })

        this.serType = res.data.taskUserInfo.serviceType === 1 ? true : false

        this.mobile = res.data.taskUserInfo.maintenanceUserPhone
        this.$nextTick(() => {
          this.form.setFieldsValue({
            serviceMode: res.data.taskUserInfo.serviceMode,
            maintenanceUserId: res.data.taskUserInfo.maintenanceUserId,
            serviceType: res.data.taskUserInfo.serviceType,
          })
        })
        if (!this.isEditSalary) {
          this.sceneType = res.data.taskUserInfo.serviceMode === 1 ? true : false
          if (this.sceneType) {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                actualMaintenanceLocation: res.data.taskUserInfo.actualMaintenanceLocation,
                actualSiteContact: res.data.taskUserInfo.actualSiteContact,
                actualSiteContactNumber: res.data.taskUserInfo.actualSiteContactNumber,
              })
            })
          }
        }

        if (this.serType) {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              screeningCost: res.data.taskUserInfo.screeningCost,
              troubleshootingCost: res.data.taskUserInfo.troubleshootingCost,
              networkId: [res.data.taskUserInfo.networkId, res.data.taskUserInfo.serviceUserName],
            })
          })
        }
        that.$refs.customerSelect &&
          that.$refs.customerSelect.fill({
            id: res.data.customerId || undefined,
            name: res.data.customerName,
          })
      })
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'handle') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              id: this.recordDetails.taskUserInfo.id,
              taskDocumentId: this.record.id,
              serviceMode: values.serviceMode,
            }
            if (values.serviceMode === 1) {
              params.actualMaintenanceLocation = values.actualMaintenanceLocation
              params.actualSiteContact = values.actualSiteContact
              params.actualSiteContactNumber = values.actualSiteContactNumber
              params.province = values.territory.toString()
              params.provinceName = this.labelName
            }

            that.spinning = true
            handleTaskDocument(params)
              .then((res) => {
                that.spinning = false
                console.log(res)
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('filet')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
    },
    handleCancel() {
      this.opinionData = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
      this.labelName = arguments[1] !== undefined ? arguments[1].map((i) => i.label).toString() : ''
    },
    birthplaceCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value })
        .then((res) => {
          //城市
          targetOption.loading = false
          targetOption.children = res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then((res) => {
          //城市
          return res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
        })
        .catch(function (err) {
          console.log(err)
          return []
        })
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
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