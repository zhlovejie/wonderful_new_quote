<template>
  <a-modal
    title="详情"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <h3>基本信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td>设备类型</td>
          <td>{{ details.deviceType }}</td>
          <td>设备状态</td>
          <td>{{ details.deviceState }}</td>
        </tr>
        <tr>
          <td>主板号</td>
          <td>{{ details.mainBoardNo }}</td>
          <td>SIM卡号</td>
          <td>{{ details.cardNo }}</td>
        </tr>
        <tr>
          <td>机构</td>
          <td>{{ details.orgName }}</td>
          <td>小区</td>
          <td>{{ details.villageName }}</td>
        </tr>
        <tr>
          <td>设备名称</td>
          <td colspan="3">{{ details.deviceName }}</td>
        </tr>
        <tr>
          <td>设备位置</td>
          <td colspan="3">{{ details.deviceLocation }}</td>
        </tr>

        <tr>
          <td>设备质保期限</td>
          <td colspan="3">{{ details.deviceWarrantyPeriod }}</td>
        </tr>
        <tr>
          <td>SIM卡服务期限</td>
          <td colspan="3">{{ details.cardServicePeriod }}</td>
        </tr>
      </table>
      <h3>设备更换信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <th>编号</th>
          <th>主板号</th>
          <th>注册人</th>
          <th>注册时间</th>
          <th>更换操作人</th>
          <th>更换时间</th>
        </tr>
        <tr v-for="(item, index) in details.deviceWdfChangeMainIdList" :key="item.index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.mainBoardNo }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.regTime }}</td>
          <td>{{ item.createName }}</td>
          <td>{{ item.createTime }}</td>
        </tr>
      </table>
      <h3>SIM更换信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <th>编号</th>
          <th>卡号</th>
          <th>更换操作人</th>
          <th>更换时间</th>
        </tr>
        <tr v-for="(item, index) in details.deviceWdfChangeSimList" :key="item.index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.simCard }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.createTime }}</td>
        </tr>
      </table>
      <h3>设备更新信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <th>编号</th>
          <th>机构</th>
          <th>小区</th>
          <th>设备位置</th>
          <th>更换操作人</th>
          <th>更换时间</th>
        </tr>
        <tr v-for="(item, index) in details.deviceReplacementInfoList" :key="item.index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.orgName }}</td>
          <td>{{ item.villageName }}</td>
          <td>{{ item.deviceLocation }}</td>
          <td>{{ item.createdName }}</td>
          <td>{{ item.createdTime }}</td>
        </tr>
      </table>
    </a-spin>
  </a-modal>
</template>

<script>
import { getDeviceArchivesDetailVo } from '@/api/after-sales-management'

export default {
  name: 'EnterpriseSynopsis',

  data() {
    return {
      visible: false,
      confirmLoading: false,
      addOredit: 'add',
      record: {},
      details: {},
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {},
  methods: {
    query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = record
      getDeviceArchivesDetailVo({ id: record.id }).then((res) => {
        this.details = res.data
      })
    },
    handleOk() {
      this.visible = false
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 15px;
}
/* you can make up upload button and sample style by using stylesheets */
</style>
