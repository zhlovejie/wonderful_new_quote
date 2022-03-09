<template>
  <div class="__fac_info_wrapper__">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" >
    <h2>实际考察信息</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>考察内容</td>
        <td>考察结果</td>
        <td>附件资料(非必填)</td>
      </tr>

      <tr >
        <td>门面图片</td>
        <td>
          <a-form-model-item label="公司全称" prop="cfullName">
            <a-input v-model="form.cfullName" />
          </a-form-model-item>
        </td>
        <td>{{ item.processName }}</td>
        <td>
          <a @click="handleAction('del', item)">删除</a>
        </td>
      </tr>
    </table>
    </a-form-model>

    <div class="steps-action">
      <a-button type="primary" @click="prev">
        上一步
      </a-button>
      <a-button type="primary" @click="next">
        提交审核
      </a-button>
      <a-button type="primary" @click="next">
        保存
      </a-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'handleInfo',
  components: {
    
  },
  data() {
    return {
      form:{},
      rules:{}
    }
  },
  methods: {
    handleAction(type, item) {
      const that = this
      if (type === 'del') {
        that.rangeVoList = that.rangeVoList.filter(_item => _item.key !== item.key)
      } else if (type === 'add') {
        let list = [...that.rangeVoList]
        list.push({
          key: that.$uuid(),
          processId: null,
          processCode: '',
          processName: '',
          workshopId: null,
          workshopName: ''
        })
        that.rangeVoList = list
      }
    },
    openModel() {
      this.$refs.selectProductProcess.init()
    },
    prev() {
      let current = 2,
        type = 'prev'
      this.$emit('change', current, type, this.rangeVoList)
    },
    next() {
      const that = this
      let current = 2,
        type = 'next'
      that.$emit('change', current, type, this.rangeVoList)
    },
    handleProcessChange(items) {
      const that = this
      let list = [...that.rangeVoList]

      items.map(item => {
        list.push({
          key: that.$uuid(),
          processId: item.id,
          processCode: item.processNum,
          processName: item.processName,
          workshopId: item.workshopId,
          workshopName: item.workshopName
        })
      })
      that.rangeVoList = list
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
.steps-action >>> .ant-btn {
  margin: 0 5px;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
</style>
