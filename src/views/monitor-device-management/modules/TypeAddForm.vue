<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <table class="custom-table custom-table-border">
          <thead>
            <tr>
              <th>序号</th>
              <th>设备类别名称</th>
              <th>序号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in deviceList" :key="item.key">
              <td>{{ idx + 1 }}</td>
              <td>
                <a-form-item>
                  <a-input
                    placeholder="设备类别名称"
                    v-decorator="[
                      `deviceList.${idx}.typeName`,
                      { initialValue: item.typeName, rules: [{ required: true, message: '请输入设备类别名称' }] },
                    ]"
                    :allowClear="true"
                    style="width: 100%"
                    @change="(e) => inputChange(item.key, 'typeName', e.target.value)"
                  />
                </a-form-item>
              </td>
              <td style="width:120px;">
                <a-form-item>
                  <a-input-number
                    :min="0"
                    :max="10000"
                    :step="1"
                    :precision="0"
                    v-decorator="[
                      `deviceList.${idx}.sortNum`,
                      { initialValue: item.sortNum, rules: [{ required: true, message: '请输入序号' }] },
                    ]"
                    style="width: 100%"
                    @change="(e) => inputChange(item.key, 'sortNum', e)"
                  />
                </a-form-item>
              </td>
              <td>
                <a-form-item>
                  <a href="javascript:void(0);" @click="itemAction('del', item.key)">删除</a>
                </a-form-item>
              </td>
            </tr>
          </tbody>
        </table>
        <a-button style="width: 100%" type="dashed" icon="plus" @click="itemAction('add')">添加设备类别</a-button>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  monitoringEquipmentTypeList,
  monitoringEquipmentTypeAdd,
  monitoringEquipmentTypeUpdate,
  monitoringEquipmentTypeDelete,
} from '@/api/monitorDeviceManagement'

import { getDictionary } from '@/api/common'

let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

export default {
  name: 'monitor-device-management-device-list-typeAddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'monitor-device-management-device-list-typeAddForm' }),
      visible: false,
      spinning: false,
      actionType: '',
      detail: {},
      record: {},
      deviceList: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    modalTitle() {
      return '管理设备类型'
    },
  },
  methods: {
    init() {
      let that = this
      let queue = []
      queue.push(monitoringEquipmentTypeList().then((res) => (that.deviceList = res.data)))
      return Promise.all(queue)
    },
    async query() {
      let that = this
      await that.init()
      that.visible = true
      monitoringEquipmentTypeList().then((res) => {
        that.deviceList = res.data.map((item) => {
          item.key = uuid()
          item.__D = false
          return item
        })
      })
    },
    handleSubmit() {
      const that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)

          let addList = that.deviceList.filter((item) => item.__A)
          let updateList = that.deviceList.filter((item) => item.id && item.__U)
          let queue = []

          addList.map((item) => queue.push(monitoringEquipmentTypeAdd(item).then((res) => res.code === 200)))
          updateList.map((item) => queue.push(monitoringEquipmentTypeUpdate(item).then((res) => res.code === 200)))

          if (queue.length === 0) {
            that.handleCancel()
            return
          }

          that.spinning = true
          Promise.all(queue)
            .then((res) => {
              if (res.every((b) => b === true)) {
                that.$message.info('操作成功')
                that.spinning = false
                that.handleCancel()
                that.$emit('finish')
              }else if (res.every((b) => b === false)) {
                that.$message.info('操作失败')
                that.spinning = false
              }else{
                that.$message.info('操作部分成功')
                that.spinning = false
                that.query()
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.info(err.message)
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.detail = {}
      this.$nextTick(() => (this.visible = false))
    },
    getDevicesTypeText(id) {
      let target = this.deviceList.find((item) => +item.id === +id)
      return target ? target.text : '未知'
    },
    itemAction(type, key) {
      const that = this
      let deviceList = [...that.deviceList]
      if (type === 'add') {
        let max = Math.max(...[...deviceList.map(item => +item.sortNum),0]) + 1
        deviceList.push({
          key: uuid(),
          typeName: undefined,
          sortNum: max,
          __A: true,
        })
        that.deviceList = deviceList
      } else if (type === 'del') {
        let target = deviceList.find((item) => item.key === key)
        if (target && target.id) {
          that.spinning = true
          monitoringEquipmentTypeDelete({ id: target.id })
            .then((res) => {
              that.spinning = false
              that.$message.info(res.msg)
              if (+res.code === 200) {
                that.deviceList = deviceList.filter((item) => item.key !== key)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.info(err.message)
            })
        } else {
          that.deviceList = deviceList.filter((item) => item.key !== key)
        }
      }
    },
    inputChange(key, k, v) {
      let deviceList = [...this.deviceList]
      let target = deviceList.find((item) => item.key === key)
      if (!target) {
        return
      }
      target[k] = v
      target.__U = true
      this.deviceList = deviceList
    },
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
