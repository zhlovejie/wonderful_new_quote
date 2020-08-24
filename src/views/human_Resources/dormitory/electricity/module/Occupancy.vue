<template>
  <a-modal
    title="查看入住情况"
    :width="1150"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <template>
        <a-card class="fl" v-for="item in recordDetails" :key="item.roomCode">
          <div>
            <span class="title">{{item.roomCode}}</span>
            <template v-if="item.emptyBed!== 0 ">
              <span style="  margin-left:10px; color:#52c41a;">有空余</span>
            </template>
            <template v-else>
              <span style="  margin-left:10px; color:red;">满员</span>
            </template>
          </div>
          <table class="custom-table custom-table-border">
            <tr>
              <td>床位</td>
              <td>{{item.bedNumber}}</td>
            </tr>
            <tr>
              <td>空床位</td>
              <td>{{item.emptyBed}}</td>
            </tr>
            <tr>
              <td colspan="2">入住情况</td>
            </tr>
            <tr>
              <td>部门</td>
              <td>人员</td>
            </tr>
            <template>
              <tr v-for=" items in  item.roomUserVos" :key="items.deptName">
                <td>{{items.deptName}}</td>
                <td>{{items.userName}}</td>
              </tr>
              <tr></tr>
            </template>
          </table>
        </a-card>
      </template>
    </a-spin>
  </a-modal>
</template>
    </a-spin>
  </a-modal>
</template>
<script>
import { electricity_PageRoomUser } from '@/api/humanResources'

export default {
  name: 'BecomingForm',

  data() {
    return {
      visible: false,
      spinning: false,
      recordDetails: [],
    }
  },

  methods: {
    query(type, record) {
      this.visible = true

      this.fillData()
    },

    fillData() {
      let that = this
      electricity_PageRoomUser().then((res) => {
        console.log(res)
        that.recordDetails = res.data
        // that.form.setFieldsValue({
        //   roomCode: res.data.roomCode,
        //   bedNumber: res.data.bedNumber,
        //   meterCode: res.data.meterCode,
        //   remark: res.data.remark,
        // })
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
.fl {
  /* float: left; */
  width: 25%;
  display: inline-block;
  height: 300px;
  overflow: auto !important;
  overflow-y: hidden;
}
.title {
  display: inline-block;
  width: 65%;
  text-align: right;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
}
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
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
</style>