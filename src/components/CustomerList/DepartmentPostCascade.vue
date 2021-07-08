<template>
  <a-cascader
    :disabled="disabled"
    v-model="localValue"
    :options="departmentOptions"
    @change="departmentCascaderChange"
    :loadData="departmentCascaderLoadData"
    :placeholder="placeholder"
  />
</template>

<script>
import {
  departmentList, //所有部门
  getStationList //获取所有岗位
} from '@/api/systemSetting'

export default {
  name: 'DepartmentPostCascade',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder:{
      type: String,
      default:() => '选择岗位'
    },
    value: {
      type: Array,
      default: () => [undefined, undefined]
    }
  },
  data() {
    return {
      departmentOptions: [], //岗位 级联 部门岗位
      localValue: [undefined, undefined]
    }
  },
  watch: {
    value(arr) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const that = this
      if(!Array.isArray(that.value)){
        console.warn(`DepartmentPostCascade 组件 value 参数必须是数组类型`)
        return
      }
      that.localValue = that.value
      let [departmentId, postId] = that.localValue
      that.departmentOptions = await that.fetchDepartment()
      await that.fetchPost(departmentId)
    },
    fetchDepartment() {
      return departmentList().then(res => {
        return res.data.map(item => {
          return { label: item.departmentName, value: item.id, isLeaf: false }
        })
      })
    },
    fetchPost(departmentId) {
      const that = this
      if (!departmentId) {
        return
      }
      return getStationList({ id: departmentId }).then(res => {
        //岗位
        let targetOption = that.departmentOptions.find(p => p.value == departmentId)
        targetOption.loading = false
        targetOption.children = res.data.map(item => {
          return { label: item.stationName, value: item.id, isLeaf: true }
        })
        that.departmentOptions = [...that.departmentOptions]
      })
    },
    departmentCascaderChange(arrSelected, arrSelectedItems) {
      this.localValue = arrSelected
      this.$emit('update:value', arrSelected)
    },
    departmentCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getStationList({ id: targetOption.value })
        .then(res => {
          targetOption.loading = false
          targetOption.children = res.data.map(item => {
            return {
              label: item.stationName,
              value: item.id,
              isLeaf: true
            }
          })
          that.departmentOptions = [...that.departmentOptions]
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }
}
</script>
