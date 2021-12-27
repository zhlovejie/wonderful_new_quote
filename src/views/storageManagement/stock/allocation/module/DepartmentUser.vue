<template>
  <a-row>
    <a-col :span="12">
      <a-select style="width: 100%" :value="info" @change="depChange" v-bind="$attrs" placeholder="选择仓库">
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.warehouseName
        }}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="12">
      <a-select style="width: 100%" :value="infoList" @change="userChange" v-bind="$attrs" placeholder="选择库区">
        <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{
          item.reservoirName
        }}</a-select-option>
      </a-select>
    </a-col>
  </a-row>
</template>

<script>
/**
 * @description 仓库选择，支持双向绑定
 */
import { getList, ReservoiGetList } from '@/api/storage'

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
        // this.init()
        console.log(val)
      },
      deep: true,
      immediate: true,
    },
    infoList: {
      handler(val, oldval) {
        console.log(val)
        this.init()
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    const that = this
    that.depList = []
    that.userList = []
    getList().then((res) => {
      that.depList = res.data
    })
  },
  methods: {
    init() {
      const that = this

      if (that.infoList) {
        // that.initUsers()
        getList({ reservoirAreaId: that.infoList }).then((res) => {
          that.depList = res.data
          if (res.code == 200 && that.info) {
            that.initDepartment(this.info)
          }
        })
      }
    },
    initDepartment(opt) {
      const that = this
      ReservoiGetList({ warehouseId: opt }).then((res) => {
        that.userList = res.data
      })
    },
    depChange(depId) {
      const that = this
      that.$emit('update:info', depId)
      const target = that.depList.find((u) => u.id === depId)
      that.$emit('update:positionCode', target.warehouseName)
      that.$emit('update:infoList', null)
      that.$emit('update:infoName', null)
      that.$emit('update:immigrateShelvesLocationId', null)
      that.$emit('update:immigratePositionId', null)
      this.initDepartment(depId)
    },
    userChange(userId) {
      const that = this
      that.$emit('update:infoList', userId)
      const target = that.userList.find((u) => u.id === userId)
      that.$emit('update:infoName', target.reservoirName)
      that.$emit('update:immigrateShelvesLocationId', null)
      that.$emit('update:immigratePositionId', null)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
