<template>
  <div class="__fac_info_wrapper__">
    <div v-for="(item,idx) in materialBoList">
      <MaterialConfig :material="item" />
    </div>
  </div>
</template>

<script>
import MaterialConfig from './MaterialConfig'
export default {
  name: 'bussessInfo',
  components: {MaterialConfig},
  props:['detail','fill','disabled'],
  data() {
    return {
      materialBoList:[]
    }
  },
  activated(){
    if(this.fill){
      let {materialBoList} = this.detail
      this.materialBoList = materialBoList.map((item,idx) => {
        item.idx = idx
        return item
      })
    }
  },
  methods: {
    validate() {
      const that = this
      return new Promise(resolve => {
        if(that.materialBoList.length === 0){
          that.$message.warning('请完善物料信息')
          resolve({code:500,result:{} })
          return
        }
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code:0,
              result:{...that.materialBoList}
            })
          } else {
            resolve({
              code:500,
              result:{}
            })
          }
        });
      })
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}

.__bussess_wrapper {
  position: relative;
  border: 2px dashed #1890ff;
  padding: 5px;
  margin-bottom: 20px;
}
.__bussess_wrapper .__item_action_del {
  position: absolute;
  top: -18px;
  right: -12px;
  z-index: 10001;
  font-size: 24px;
  color: #1890ff;
  background-color: #fff;
  cursor: pointer;
}
</style>
