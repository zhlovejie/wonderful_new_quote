<template>
  <a-modal title="详情" :width="750" :visible="visible" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
    <a-spin :spinning="spinning">
      <div>
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 50%">日期</td>
            <td>{{ detail.date }}</td>
          </tr>
          <tr>
            <td>物流单号</td>
            <td>{{ detail.logisticsOrderNo }}</td>
          </tr>
          <tr>
            <td>工价（元）</td>
            <td>{{ detail.wages }}</td>
          </tr>
        </table>
        <h3>货物信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th>物料代码</th>
            <th>名称</th>
            <th>数量</th>
            <th>方数</th>
            <th>工价</th>
          </tr>
          <tr v-for="item in detail.logisticsCarryAdminInfoGoods" :key="item.id">
            <td>{{ item.materialCode }}</td>
            <td>{{ item.productName }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.squareNum }}</td>
            <td>{{ item.wages }}</td>
          </tr>
        </table>
      </div>

      <h3>人员信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <th>姓名</th>
          <th>工价</th>
        </tr>
        <tr v-for="item in detail.logisticsCarryAdminInfoUsers" :key="item.id">
          <td>{{ item.userName }}</td>
          <td>{{ item.wages }}</td>
        </tr>
      </table>
    </a-spin>
  </a-modal>
</template>

<script>
import { admingetDetail } from '@/api/distribution-management'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      detail: {},
    }
  },
  computed: {},
  methods: {
    async handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    async query(type) {
      let that = this
      that.visible = true
      admingetDetail({ id: type.id }).then((res) => {
        console.log(res)
        this.detail = res.data
      })
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>