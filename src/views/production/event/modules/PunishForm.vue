<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form :form="form">
      <template v-for="prcl in event.principals">
        <a-row class="form-row" :gutter="24">
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="负责人:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
              {{ prcl.responsibleName }}
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="罚款金额:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
              {{ prcl.penaltyAmount }}
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="是否免责:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
              <template v-if="prcl.isExemption === 1">是</template>
              <template v-else>否</template>
            </a-form-item>
          </a-col>
        </a-row>
        <template v-for="responsible in prcl.responsibles">
          <a-row class="form-row" :gutter="24">
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="责任人:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
                {{ responsible.dutyName }}
                <template v-if="responsible.isMain === 1">[主]</template>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="罚款金额:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
                {{ responsible.penaltyAmount }}
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="是否免责:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
                <template v-if="responsible.isExemption === 1">是</template>
                <template v-else>否</template>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <a-divider/>
      </template>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="解决方案汇总:" :labelCol="singleLabel" :wrapperCol="singleWrapper">
            <a-textarea read-only="read-only" v-decorator="['totalSolution',{initialValue: event.totalSolution}]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { getPunishView } from '@/api/production/event'
export default {
  name: 'PunishForm', // 质量主管处罚或者董事长结案展示页
  data () {
    return {
      visible: false, // 是否显示
      event: {}, // 负责人信息
      title: '',
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      singleLabel: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      },
      singleWrapper: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      threeLabel: {
        xs: { span: 5 },
        sm: { span: 5 }
      },
      threeWrapper: {
        xs: { span: 15 },
        sm: { span: 15 }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (eventId, handler) {
      getPunishView({ eventId, handler }).then(res => {
        if (res.code === 200) {
          this.event = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      if (handler === 2) {
        this.title = '质量主管的处罚方案'
      } else if (handler === 3) {
        this.title = '董事长的结案方案'
      }
      this.visible = true
    },
    handleCancel () {
      this.event = {}
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
