<template>
  <a-cascader
    :disabled="disabled"
    :value="fillValue"
    :options="areaOptions"
    @change="areaCascaderChange"
    :loadData="areaCascaderLoadData"
    placeholder="选择区域"
    :style="{width:levelByWidth}" 
    :expandTrigger="expandTrigger"
  />
</template>
<script>
import { getAreaByParent } from '@/api/common'
export default {
  name: 'AreaCascade',
  props: {
    level: {
      //默认可展开级别 默认 省市区3级 ，最大可支持4级
      type: Number,
      default: 3
    },
    disabled: {
      type: Boolean,
      default: false
    },
    expandTrigger:{
      type:String,
      default:'click'
    },
    fill: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    levelByWidth() {
      let m = { 1: '150px', 2: '210px', 3: '270px', 4: '330px' }
      return m[this.level] || '180px'
    }
  },
  data() {
    return {
      areaOptions: [], //籍贯 级联 省市
      fillValue:[]
    }
  },
  mounted() {
    let that = this
    that.init().then(() => {
      that.fillAction()
    })
  },
  watch:{
    fill(){
      this.fillValue = [...this.fill || []].map(v => parseInt(v,10))
      this.fillAction()
    }
  },
  methods: {
    async init() {
      let that = this
      that.areaOptions = []

      if (this.level > 4) {
        this.level = 4
        console.warn('AreaCascade 组件最大支持4级级联.')
      }

      let queue = []
      let task1 = this.loadAreaAction(100000).then(res => (that.areaOptions = res))
      queue.push(task1)
      return Promise.all(queue)
    },
    async fillAction() { //回显填充
      let that = this
      let arrAreas = [...that.fillValue]
      let needFillAreas = arrAreas.slice(0, -1) //最后一个不需要填充
      if (needFillAreas.length > 0) {
        let targetAreaOptions = that.areaOptions
        for (let val of needFillAreas) {
          let targetArea = targetAreaOptions.find(item => +item.value === +val)
          if (targetArea) {
            let children = await that.areaCascaderLoadData([targetArea])
            targetAreaOptions.children = [...children]
            targetAreaOptions = [...children]
          }
        }
      }
    },
    areaCascaderChange(arrArea, arrAreaItems) {
      this.fillValue = [...arrArea]
      this.$emit('change', [...arrArea], [...arrAreaItems])
    },
    areaCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      if (Array.isArray(targetOption.children)) {
        targetOption.loading = false
        return [...targetOption.children]
      }
      return this.loadAreaAction(targetOption.value)
        .then(res => {
          //城市
          targetOption.loading = false
          targetOption.children = res
          that.areaOptions = [...that.areaOptions]
          return [...targetOption.children]
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then(res => {
          //城市
          return res.data.map(item => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level >= that.level ? true : false
            }
          })
        })
        .catch(function(err) {
          console.log(err)
          return []
        })
    }
  }
}
</script>
<style scoped>
</style>