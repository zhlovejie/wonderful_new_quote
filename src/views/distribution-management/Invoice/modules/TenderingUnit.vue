<template>
  <a-modal
    title="客户信息"
    :width="600"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <p>客户名称：{{ customerName }}</p>
      <p>联系人：{{ linkManName }}</p>
      <p>联系方式：{{ linkManPhone }}</p>
      <p>地址：{{ customerAddress }}</p>
    </a-spin>

  </a-modal>

</template>

<script>
import { queryByCustomerId } from '@/api/investigate'

export default {
  name: 'Tendering',
  data () {
    return {
      customerName: '',
      linkManName: '',
      linkManPhone: '',
      customerAddress: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    look (e) {
      queryByCustomerId(e).then((res) => {
        if (res.code == 200) {
          const data = res.data
          this.visible = true
          console.log('queryByCustomerId data' + JSON.stringify(data))
          this.$nextTick(() => {
            this.customerName = data.customerName
            this.linkManName = data.linkManName
            this.linkManPhone = data.linkManPhone
            this.customerAddress = data.customerAddress
          })
        } else {
          this.$message.error('暂无用户数据')
        }
      })
    }
  }
}
</script>
