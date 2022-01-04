<template>
  <a-row>
    <a-col :span="11">
      <a-select style="width: 100%" :value="selfInfo.depId" @change="depChange" v-bind="$attrs" placeholder="部门">
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="11" :offset="2">
      <a-select style="width: 100%" :value="selfInfo.userId" @change="userChange" v-bind="$attrs" placeholder="人员">
        <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{ item.trueName }}</a-select-option>
      </a-select>
    </a-col>
  </a-row>
</template>

<script>
/**
 * @description 部门人员级联选择，支持双向绑定
 */
import {
  departmentList, //所有部门
  getUserByDep, //获取人员
} from '@/api/systemSetting'

export default {
  name: 'DepartmentUserCascade',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      depList: [],
      userList: [],
      depListLoaded: false,
    }
  },
  computed: {
    selfInfo: {
      get() {
        return { ...this.info }
      },
      set() {},
    },
  },
  watch: {
    info: {
      handler() {
        this.init()
      },
    },
  },
  created() {
    const that = this
    that.depList = []
    that.userList = []
    that.initDepartment()
    that.init()
  },
  methods: {
    init() {
      const that = this
      const { depId, userId } = that.selfInfo
      if (depId && userId) {
        that.initUsers(depId)
      }
    },
    initDepartment() {
      const that = this
      departmentList().then((res) => {
        that.depList = res.data
      })
    },
    initUsers(depId) {
      //人员 id,trueName
      const that = this
      that.userList = []
      if (!depId) {
        return
      }
      getUserByDep({ departmentId: depId }).then((res) => (that.userList = res.data))
    },
    depChange(depId) {
      const that = this
      const target = that.depList.find((dep) => dep.id === depId)
      that.initUsers(depId)
      that.$emit('update:info', {
        depId,
        depName: target ? target.departmentName : undefined,
        userId: undefined,
        userName: undefined,
      })
    },
    userChange(userId) {
      const that = this
      const target = that.userList.find((u) => u.id === userId)
      that.$nextTick(() => {
        that.$emit('update:info', {
          ...that.selfInfo,
          userId,
          userName: target ? target.trueName : undefined,
          mobile: target ? target.mobile : undefined,
        })
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
