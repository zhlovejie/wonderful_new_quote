<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">车牌号</td>
            <td style="width:300px;">
              <a-form-item>
                <span >{{detail.carCode}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">驾车方式</td>
            <td>
              <a-form-item>
                <span >{{ {1:'自驾',2:'司机'}[detail.driverMode] }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr >
            <td>司机</td>
            <td >
              <a-form-item>
                <span >{{detail.driverUserName}}</span>
              </a-form-item>
            </td>
            <td>用车时间</td>
            <td >
              <a-form-item>
                <span >{{detail.useTime}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr >
            <td>返回时间</td>
            <td >
              <a-form-item>
                <span >{{detail.returnTime}}</span>
              </a-form-item>
            </td>
            <td>始发地点</td>
            <td >
              <a-form-item>
                <span >{{detail.cardName}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr >
            <td>目的地</td>
            <td >
              <a-form-item>
                <span >{{detail.cardName}}</span>
              </a-form-item>
            </td>
            <td>乘车人</td>
            <td >
              <a-form-item>
                <span >{{detail.cardName}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr >
            <td>用车事由</td>
            <td colspan="3">
              <a-form-item>
                <div  v-html="formatHTML(detail.reason)" ></div>  
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
  carUseDetail
} from '@/api/vehicleManagement'

import moment from 'moment'

function makeKey() {
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  components: {
    
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {}
    }
  },
  watch: {},
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isRecharge(){
      return this.type === 'recharge'
    },
    modalTitle() {
      let m = {
        'add':'新增',
        'view':'查看',
        'edit':'修改',
        'recharge':'充值',
      }
      return m[this.type]
    },
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.form.resetFields()
      await that.initData()
      
        that.spinning = true
        let _detail = null
        try {
          _detail = await carUseDetail({ id: record.id }).then((res) => res.data)
          that.spinning = false
          that.detail = { ..._detail }
        } catch (err) {
          console.log(err)
          that.spinning = false
        }
      
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },

    handleSubmit() {
      that.handleCancel()
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    formatHTML(htmlStr){
      if(typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g,'<br/>')
      htmlStr = htmlStr.replace(/\s+/g,'&nbsp;')
      return htmlStr
    }
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td {
  padding: 5px 10px;
  text-align: center;
}

.wdf-custom-form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
