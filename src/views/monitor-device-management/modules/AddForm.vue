<template>
  <a-modal
    :title="modalTitle"
    :width="900"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 120px">设备类别</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  placeholder="设备类别"
                  v-decorator="[
                    'typeId',
                    { initialValue: detail.typeId, rules: [{ required: true, message: '请选择设备类别' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                >
                  <a-select-option v-for="item in deviceList" :key="item.id" :value="item.id">{{item.typeName}}</a-select-option>
                </a-select>
                <span v-else>{{ getDevicesTypeText(detail.typeId) }}</span>
              </a-form-item>
            </td>
            <td style="width: 120px">设备名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="设备名称"
                  v-decorator="[
                    'equipmentName',
                    { initialValue: detail.equipmentName, rules: [{ required: true, message: '请输入设备名称' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentName }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">设备编码</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="设备编码"
                  v-decorator="[
                    'equipmentCode',
                    { initialValue: detail.equipmentCode, rules: [{ required: true, message: '请输入设备编码' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentCode }}</span>
              </a-form-item>
            </td>
            <td style="width: 120px">设备状态</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  placeholder="设备状态"
                  v-decorator="[
                    'equipmentStatus',
                    { initialValue: detail.equipmentStatus || 1, rules: [{ required: true, message: '请选择设备状态' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                >
                  <a-select-option :value="1">在线</a-select-option>
                  <a-select-option :value="2">不在线</a-select-option>
                </a-select>
                <span v-else>{{ { 1: '在线', 2: '不在线' }[detail.equipmentStatus] }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">设备位置</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="设备位置"
                  v-decorator="[
                    'equipmentLocation',
                    { initialValue: detail.equipmentLocation, rules: [{ required: true, message: '请输入设备位置' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentLocation }}</span>
              </a-form-item>
            </td>
            <td style="width: 120px">设备验证码</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="设备验证码"
                  v-decorator="[
                    'equipmentAuthCode',
                    {
                      initialValue: detail.equipmentAuthCode,
                      rules: [{ required: false, message: '请输入设备验证码' }],
                    },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentAuthCode || '-' }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">设备密码</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="设备密码"
                  v-decorator="[
                    'equipmentPassword',
                    { initialValue: detail.equipmentPassword, rules: [{ required: false, message: '请输入设备密码' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentPassword || '-' }}</span>
              </a-form-item>
            </td>
            <td style="width: 120px">WIFI</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="WIFI"
                  v-decorator="[
                    'equipmentWifi',
                    { initialValue: detail.equipmentWifi, rules: [{ required: false, message: '请输入WIFI' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentWifi || '-'}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">设备IP</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="设备IP"
                  v-decorator="[
                    'equipmentIp',
                    { initialValue: detail.equipmentIp, rules: [{ required: false, message: '请输入设备IP' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.equipmentIp || '-'}}</span>
              </a-form-item>
            </td>
            <td style="width: 120px">备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remark',
                    { initialValue: detail.remark, rules: [{ required: false, message: '请输入备注' }] },
                  ]"
                />
                <span v-else>
                  {{ detail.remark || '-'}}
                </span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  monitoringEquipmentDetail,
  monitoringEquipmentAdd,
  monitoringEquipmentUpdate,
  monitoringEquipmentTypeList
} from '@/api/monitorDeviceManagement'
import { getDictionary } from '@/api/common'
export default {
  name: 'monitor-device-management-device-list-addForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'monitor-device-management-device-list-addForm' }),
      visible: false,
      spinning: false,
      actionType:'',
      detail: {},
      record: {},
      deviceList:[],
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批', view1: '查看' }
      return `${obj[this.actionType]}设备`
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
      //此状态下表单元素被禁用
      return this.isView
    },
  },
  methods: {
    init() {
      let that = this
      let queue = []
      queue.push(monitoringEquipmentTypeList().then(res => that.deviceList = res.data))
      return Promise.all(queue)
    },
    async query(type, record) {
      //debugger
      let that = this
      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.detail = {}
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      that.spinning = true
      monitoringEquipmentDetail({ id: record.id }).then((res) => {
        that.spinning = false
        that.detail = res.data
      })
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          let api = that.isAdd ? monitoringEquipmentAdd : monitoringEquipmentUpdate
          that.spinning = true
          api(values)
            .then((res) => {
              that.spinning = false
              that.$message.info(res.msg)
              if(res.code === 200){
                that.handleCancel()
                that.$emit('finish')
              }
            })
            .catch((err) => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.detail = {}
      this.$nextTick(() => (this.visible = false))
    },
    getDevicesTypeText(id){
      let target = this.deviceList.find(item => +item.id === +id)
      return target ? target.typeName : '未知'
    }
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: center;
}
</style>
