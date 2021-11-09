<template>
  <a-modal title="付款码" :width="800" :visible="visible" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk">保存</a-button>
      </template>
    </template>
    <div style="height: 360px">
      <div>
        <h2 style="text-align: center">{{ totalAmount }}</h2>
      </div>
      <!-- <a-alert style="margin-bottom: 20px" :message="totalAmount" type="success" /> -->
      <a-list :grid="{ gutter: 24, column: 2 }">
        <a-list-item>
          <a-card title="支付宝">
            <div class="android-qrcode-wrapper">
              <vue-qr :text="recordDetails" :size="200"></vue-qr>
            </div>
          </a-card>
        </a-list-item>
        <a-list-item>
          <a-card title="微信">
            <div class="android-qrcode-wrapper">
              <vue-qr :text="qrText" :size="200"></vue-qr>
            </div>
          </a-card>
        </a-list-item>
      </a-list>
    </div>
  </a-modal>
</template>
<script>
import { getAliPayQrCode, getWxPayQrCode, accessoriesManagementDetail } from '@/api/after-sales-management' //机构名称
import VueQr from 'vue-qr'
export default {
  name: 'BecomingForm',
  components: {
    VueQr,
  },
  data() {
    return {
      record: {},
      visible: false,
      recordDetails: '',
      qrText: '',
      totalAmount: undefined,
    }
  },
  computed: {},

  created() {},
  methods: {
    async query(record) {
      this.visible = true
      this.record = record
      this.fillData()
    },
    fillData() {
      let that = this
      let id = {
        id: that.record.id,
      }
      getAliPayQrCode(id).then((res) => {
        that.recordDetails = res.data
      })
      getWxPayQrCode(id).then((res) => {
        that.qrText = res.data
      })
      accessoriesManagementDetail(id).then((res) => {
        this.totalAmount = `付款总金额为: ${res.data.totalAmount}`
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
.android-qrcode-wrapper {
  text-align: center;
}
</style>