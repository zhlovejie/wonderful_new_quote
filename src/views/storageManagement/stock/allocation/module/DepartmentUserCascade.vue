<template>
  <a-row>
    <a-col :span="12">
      <a-select style="width: 100%" :value="info" @change="depChange" v-bind="$attrs" placeholder="选择库位">
        <a-select-option v-for="item in depList" :key="item.shelvesLocationId" :value="item.shelvesLocationId">{{
          item.shelvesLocationName
        }}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="12">
      <a-select style="width: 100%" :value="PositionId" @change="userChange" v-bind="$attrs" placeholder="选择仓位">
        <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{
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
import { translocateGetShelvesByAreaId, translocateGetPositionList } from '@/api/storage'

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
    PositionId: {
      type: Number,
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
        // this.depChange()
        // this.initDepartment()
        console.log(val)
      },
      deep: true,
      immediate: true,
    },
    PositionId: {
      handler(val, oldval) {
        // this.depChange()
        // this.initDepartment()
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
    // that.initDepartment()
    // that.init()
  },
  methods: {
    init() {
      const that = this

      if (that.infoList) {
        // that.initUsers()
        translocateGetShelvesByAreaId({ areaId: that.infoList, materialId: that.materialId }).then((res) => {
          that.depList = res.data
          if (res.code == 200 && that.info) {
            this.initDepartment({ react: that.info, type: this.type })
            // const target = that.depList.find((u) => u.shelvesLocationId === that.info)
            // that.userList = target.positionModelVoList || []
          }
        })
      }
    },
    initDepartment(depId) {
      const that = this
      translocateGetPositionList({
        shelvesLocationId: depId.react,
        materialId: that.materialId,
        type: depId.type,
      }).then((res) => {
        that.userList = res.data.filter((i) => i.positionCode !== that.removePosition) || []
      })
    },
    depChange(depId) {
      const that = this
      that.$emit('update:info', depId)
      const target = that.depList.find((u) => u.shelvesLocationId === depId)
      this.initDepartment({ react: depId, type: target.type })
      that.$emit('update:positionCode', target.shelvesLocationName)
      that.$emit('update:PositionId', null)
      that.$emit('update:PositionName', null)
    },
    userChange(userId) {
      const that = this
      that.$emit('update:PositionId', userId)
      const target = that.userList.find((u) => u.id === userId)
      that.$emit('update:PositionName', target.positionCode)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
