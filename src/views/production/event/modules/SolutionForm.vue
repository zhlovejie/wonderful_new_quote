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
      <!--span:在屏幕中的占比，offset：距离左边距离，lg大屏，md中屏，sm小屏-->
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="解决方案" :labelCol="singleLabel" :wrapperCol="singleWrapper">
            <a-textarea read-only="read-only" v-decorator="['solution',{initialValue: principal.solution}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="负责人被处罚金额" :labelCol="singleLabel" :wrapperCol="singleWrapper">
            {{ principal.penaltyAmount }}
          </a-form-item>
        </a-col>
      </a-row>
      <template v-for="responsible in responsibles">
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="责任人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ responsible.dutyName }}<template v-if="responsible.isMain === 1">[主]</template>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="处罚金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ responsible.penaltyAmount }}
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>
  </a-modal>
</template>

<script>
import { responsiblesByPrincipal } from '@/api/production/event'
export default {
  name: 'SolutionFrom', // 部门领导人的解决方案展示页
  data () {
    return {
      visible: false, // 是否显示
      principal: {}, // 负责人信息
      responsibles: [], // 责任人集合
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
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (record) {
      console.log('re===', record)
      responsiblesByPrincipal({ principalId: record.id }).then(res => {
        if (res.code === 200) {
          this.responsibles = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.title = record.responsibleName + '的解决方案'
      this.visible = true
      this.principal = record
    },
    handleCancel () {
      this.principal = {}
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
