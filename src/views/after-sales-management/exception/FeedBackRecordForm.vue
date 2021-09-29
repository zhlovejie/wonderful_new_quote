<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <th >
              是否解决
            </th>
            <th >
              解决时间
            </th>
            <th >
              备注信息
            </th>
          </tr>
          <tr v-if="record">
            <td>{{ {1:'是',2:'否'}[record.isSolved] }}</td>
            <td>{{ record.solvedTime }}</td>
            <td>{{ record.remark }}</td>
          </tr>
          <tr v-else>
            <td colspan="3">无记录</td>
          </tr>
        </tbody>
      </table>
    </a-spin>
  </a-modal>
</template>
<script>

import {
  exceptionReportFeedback,
} from '@/api/after-sales-management-custom'
export default {
  components:{

  },
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      record:null
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return '反馈记录详情'
    },
  },
  methods:{
    query(record){
      const that = this
      that.visible = true
      that.spinning = true
      exceptionReportFeedback({id:record.id}).then(res => {
        that.spinning = false
        that.record = res.data
      }).catch(err => {
        that.spinning = true
        that.$message.error(err)
      })
    },
    handleCancel(){
      this.record = null
      this.visible = false
    }
  }
}
</script>

<style scoped>

.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
</style>


