<template>
  <div class="__fac_info_wrapper__">
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>车间名称</td>
        <td>工序代码</td>
        <td>工序名称</td>
        <td>操作</td>
      </tr>

      <tr v-for="(item, idx) in rangeVoList">
        <td>{{ idx + 1 }}</td>
        <td>{{ item.workshopName }}</td>
        <td>{{ item.processCode }}</td>
        <td>{{ item.processName }}</td>
        <td>
          <a @click="handleAction('del', item)">删除</a>
        </td>
      </tr>
    </table>

    <a-button style="width: 100%" type="dashed" icon="plus" @click="openModel">新增工艺工序信息</a-button>
    <div class="steps-action">
      <a-button type="primary" @click="prev">
        上一步
      </a-button>
      <a-button type="primary" @click="next">
        下一步
      </a-button>
    </div>
    <SelectProductProcess ref="selectProductProcess" @change="handleProcessChange" />
  </div>
</template>

<script>
import SelectProductProcess from './SelectProductProcess'
export default {
  name: 'handleInfo',
  components: {
    SelectProductProcess
  },
  data() {
    return {
      rangeVoList: []
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
      that.$emit('change', current, type, this.rangeVoList)
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
