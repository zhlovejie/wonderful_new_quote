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
      <template v-if="rangeVoList.length > 0">
        <tr v-for="(item, idx) in rangeVoList" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td>{{ item.workshopName }}</td>
          <td>{{ item.processCode }}</td>
          <td>{{ item.processName }}</td>
          <td>
            <a @click="handleAction('del', item)">删除</a>
          </td>
        </tr>
      </template>
    </table>

    <a-button style="width: 100%" type="dashed" icon="plus" @click="openModel">新增工艺工序信息</a-button>

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
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if(that.rangeVoList.length > 0){
          resolve({
              code:0,
              result:{
                facInfoRangeBoList:[...that.rangeVoList]
              }
            })
        }else{
          that.$message.warning('请新增工艺工序信息')
          resolve({
              code:500,
              result:{}
            })
        }
      })
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
