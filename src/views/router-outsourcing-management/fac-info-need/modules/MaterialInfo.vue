<template>
  <div class="__fac_info_wrapper__">
    <h2>选择要加工的成品物料信息</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>委外加工需求单号</td>
        <td>物料代码</td>
        <td>物料名称</td>
        <td>规格型号</td>
        <td>单位</td>
        <td>关联生产任务单</td>
        <td>需求日期</td>
        <td>加工数量</td>
        <td>操作</td>
      </tr>
      <template v-if="materialBoList.length > 0">
        <tr v-for="(item, idx) in materialBoList" :key="item.key">
          <td>{{ idx + 1 }}</td>
          <td>-</td>
          <td>
            <MaterialFuzzySearch style="width:180px;" :materialType="2" @change="record => handlerMaterialChange(record, item)" />
          </td>
          <td>{{ item.materialName }}</td>
          <td>
            <a-popover title="规格型号" v-if="item.specification">
              <template slot="content">
                <p style="width:350px;">{{ item.specification }}</p>
              </template>
              <a-button size="small">
                查看
              </a-button>
            </a-popover>
          </td>
          <td>{{ item.subUnit }}</td>
          <td>{{ item.productTaskNo }}</td>
          <td>
            <a-date-picker v-model="item.needDate" format="YYYY-MM-DD" style="width:120px;" />
          </td>
          <td>
            <a-input-number v-model="item.processCount" :min="0" :step="1" :precision="0" style="width:80px;" />
          </td>
          <td>
            <a @click="handleAction('del', item)">删除</a>
          </td>
        </tr>
      </template>
    </table>

    <a-button style="width: 100%" type="dashed" icon="plus" @click="handleAction('add')">添加物料</a-button>
  </div>
</template>

<script>
import moment from 'moment'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'
export default {
  name: 'handleInfo',
  components: {
    MaterialFuzzySearch
  },
  inject:['baseInfo'],
  props: ['detail', 'fill', 'disabled'],
  data() {
    return {
      materialBoList: []
    }
  },
  // watch:{
  //   'baseInfo':{
  //     handler(detail){
  //       if(detail){
  //         const {applyNo,needDate} = detail
  //         this.materialBoList = this.materialBoList.map(item => {
  //           if(!item.applyNo){
  //             item.applyNo = applyNo
  //           }
  //           if(!item.needDate){
  //             item.needDate = moment(needDate).clone()
  //           }
  //           return item
  //         })
  //       }
  //     },
  //     deep:true
  //   }
  // },

  methods: {
    handleAction(type, item) {
      const that = this
      if (type === 'del') {
        that.materialBoList = that.materialBoList.filter(_item => _item.key !== item.key)
      } else if (type === 'add') {
        const {productTaskId,productTaskNo,needDate} = that.baseInfo.form
        let list = [...that.materialBoList]
        list.push({
          key: that.$uuid(),
          applyNo:  '',
          materialId: '',
          materialName: '',
          materialCode: '',
          specification: '',
          subUnit: '',
          productTaskId,
          productTaskNo,
          needDate: moment(needDate).clone(),
          processCount: '',
          type: 1 // 物料类型：1 成品物料 2 常规物料
        })
        that.materialBoList = list
      }
    },
    handlerMaterialChange(record, item) {
      const that = this
      let materialBoList = [...that.materialBoList]
      let target = materialBoList.find(m => m.key === item.key)
      if (target) {
        target.materialId = record.materialId
        target.materialName = record.materialName
        target.materialCode = record.materialCode
        target.subUnit = record.materialUnit
        target.specification = record.modelType
        target.type = record.type || 1
        that.materialBoList = materialBoList
      }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if (that.materialBoList.length > 0) {
          resolve({
            code: 0,
            result: {
              materialBoList: [...that.materialBoList]
            }
          })
        } else {
          that.$message.warning('请添加物料')
          resolve({
            code: 500,
            result: {}
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
