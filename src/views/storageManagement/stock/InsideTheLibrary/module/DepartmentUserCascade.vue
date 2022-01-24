<template>
  <a-row>
    <a-col :span="24">
      <a-select style="width: 100%" :value="info" @change="depChange" v-bind="$attrs" placeholder="选择库位">
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.positionCode
        }}</a-select-option>
      </a-select>
    </a-col>
  </a-row>
</template>

<script>
/**
 * @description 仓位选择，支持双向绑定
 */
import { translocateGetPositionList } from '@/api/storage'

export default {
  name: 'DepartmentUser',
  props: {
    info: {
      type: Number,
      default: '',
    },
    infoList: {
      type: Number,
      default: '',
    },
    materialId: {
      type: Number,
      default: '',
    },
    types: {
      type: String,
      default: '',
    },
    removePosition: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      depList: [],
      userList: [],
      depListLoaded: false,
    }
  },

  watch: {
    info: {
      handler(val, oldval) {
        console.log(val)
      },
      deep: true,
      immediate: true,
    },
    infoList: {
      handler(val, oldval) {
        this.init()
        console.log(val)
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    const that = this
    that.depList = []
    that.userList = []
  },
  methods: {
    init() {
      const that = this

      if (that.infoList) {
        // that.initUsers()
        translocateGetPositionList({
          shelvesLocationId: that.infoList,
          materialId: that.materialId,
          type: that.types,
        }).then((res) => {
          that.depList = res.data.filter((i) => i.positionCode !== that.removePosition)
        })
      }
    },
    depChange(depId) {
      const that = this

      that.$emit('update:info', depId)
      const target = that.depList.find((u) => u.id === depId)
      that.$emit('update:positionCode', target.positionCode)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
