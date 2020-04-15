<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="savePunish"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <!-- 处罚事件的时候 -->
      <template v-for="prcl in event.principals">
        <a-row :key="prcl.index" class="form-row" :gutter="24">
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="负责人:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
              {{ prcl.responsibleName }}
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="罚款金额:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
              <a-input
                v-decorator="['pAmount-' + prcl.id,{initialValue: prcl.penaltyAmount},{rules: [{required: true, min: 1,pattern: '^[0-9]*$', message: '罚款金额必须为数字且不可为空！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="是否免责:" :labelCol="threeLabel" :wrapperCol="threeWrapper">
              <a-radio-group
                v-decorator="['pIsExemption-'+prcl.id,{initialValue: prcl.isExemption}]"
              >
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <template v-for="responsible in prcl.responsibles">
          <a-row :key="responsible.index" class="form-row" :gutter="24">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item
                label="责任人:"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >{{ responsible.dutyName }}</a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="是否为主责任人:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-radio-group v-decorator="['rIsMain-'+responsible.id,{initialValue: responsible.isMain}]">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :key="responsible.index" class="form-row" :gutter="24">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="罚款金额:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="['rAmount-'+responsible.id,{initialValue: responsible.penaltyAmount},{rules: [{required: true, min: 1,pattern: '^[0-9]*$', message: '罚款金额必须为数字且不可为空！'}]}]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="是否免责:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-radio-group v-decorator="['rIsExemption-'+responsible.id,{initialValue: responsible.isExemption}]">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
      </template>
      <a-row class="form-row" :gutter="24" v-if="show === 1">
        <a-divider/>
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="解决方案汇总:" :labelCol="singleLabel" :wrapperCol="singleWrapper">
            <a-textarea v-decorator="['totalSolution',{rules: [{required: true, min: 5, message: '解决方案汇总最少为5个字符！'}]}]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { getPunishView, pcPunish } from '@/api/production/event'
export default {
  name: 'DoPunishForm', // 质量主管处罚或者董事长结案表单页
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
      handler: '',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (eventId, handler) {
      this.hander = handler
      getPunishView({ eventId, handler }).then(res => {
        if (res.code === 200) {
          this.event = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      if (handler === 1) {
        this.title = '处罚事件'
      } else if (handler === 2) {
        this.title = '结案事件'
      }
      this.visible = true
    },
    savePunish () {
      const totalSolution = this.form.getFieldValue('totalSolution')
      if ((totalSolution === undefined || totalSolution.length < 5 || totalSolution === '') && this.handler === 1) {
        console.log(1111)
        this.form.setFields({ 'totalSolution': { errors: [{ 'message': '解决方案汇总最少为5个字符！' }] } })
        return false
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const event = this.event
          const param = { id: event.id, totalSolution: totalSolution }
          const principals = [] // 所有的负责人
          var haveMain = true
          for (var z = 0; z < event.principals.length; z++) {
            var mainCount = 0 // 此部门主责任人的个数
            const principal = event.principals[z]
            const pAmount = this.form.getFieldValue('pAmount-' + principal.id)
            const pIsExemption = this.form.getFieldValue('pIsExemption-' + principal.id)
            this.$set(principal, 'penaltyAmount', pAmount)
            this.$set(principal, 'isExemption', pIsExemption)
            const responsibles = [] // 所有责任人
            for (var j = 0; j < principal.responsibles.length; j++) {
              const rp = principal.responsibles[j]
              const rAmount = this.form.getFieldValue('rAmount-' + rp.id)
              const isMain = this.form.getFieldValue('rIsMain-' + rp.id)
              const rIsExemption = this.form.getFieldValue('rIsExemption-' + rp.id)
              mainCount += isMain
              const responsible = {
                dutyUser: rp.dutyUser,
                responsibleDep: rp.responsibleDep,
                penaltyAmount: rAmount,
                isMain: isMain,
                isExemption: rIsExemption }
              responsibles.push(responsible)
            }
            this.$set(principal, 'responsibles', responsibles)
            principals.push(principal)
            if (mainCount !== 1) {
              haveMain = false
            }
          }
          if (!haveMain) {
            this.$message.error('每个部门必须有且只能有一个主责任人!')
            return false
          } else {
            this.$set(param, 'principals', principals)
            pcPunish(param).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')
                this.$message.success('保存成功')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    },
    handleCancel () {
      this.event = {}
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
