<template>
  <div class="content-wrap">
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">培训情况</a-col>
    </a-row>
    <div>
      <template>
        <a-select
          @change="Read"
          placeholder="阅读状态"
          :allowClear="true"
          style="width: 180px;margin-left:50px;"
        >
          <a-select-option :value="0">未阅</a-select-option>
          <a-select-option :value="1">已阅</a-select-option>
        </a-select>
      </template>
      <table class="custom-table custom-table-border" style="margin-top:20px">
        <tr>
          <th>
            <b>部门</b>
          </th>
          <th>
            <b>岗位</b>
          </th>
          <th>
            <b>姓名</b>
          </th>
          <th>
            <b>状态</b>
          </th>
          <th>
            <b>时间</b>
          </th>
        </tr>
        <tr v-for="(item,index) in goodsList " :key="index">
          <td>{{item.departmentName}}</td>
          <td>{{item.stationName}}</td>
          <td>{{item.userName}}</td>
          <td>
            <template v-if="item.readFlag===0">
              <span>未阅</span>
            </template>
            <template v-else>
              <span>已阅</span>
            </template>
          </td>
          <td>{{item.readTime}}</td>
        </tr>
      </table>

      <a-form class="form wdf-form">
        <a-form-item class="btns-grop" style="border-left: none">
          <template>
            <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
            <a-button type="primary" @click="nextStep()">退出</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { logisticsPreservation } from '@/api/distribution-management'

export default {
  name: 'Step5',
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      goodsList: [],
      isProductOrder: false,
      queryonedata1: {},
      isSee: false,
    }
  },
  computed: {},
  watch: {
    queryonedata: function (newVal, oldVal) {
      this.queryonedata1 = newVal
      this.quweyData()
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
  },
  mounted() {
    this.quweyData()
  },
  methods: {
    quweyData() {
      let qt = this.queryonedata1 ? this.queryonedata1 : {}
      if (qt.userList) {
        this.goodsList = qt.userList
      }
    },

    Read(id) {
      this.goodsList = this.queryonedata1.userList
      if (id === 0) {
        this.goodsList = this.goodsList.filter((item) => item.readFlag === id)
      } else if (id === 1) {
        this.goodsList = this.goodsList.filter((item) => item.readFlag === id)
      } else {
        this.goodsList = this.queryonedata1.userList
      }
    },
    // 点击下一步
    nextStep(status) {
      this.$emit('nextStep', {})
    },
    // 上一步
    prevStep() {
      this.$emit('prevStep')
    },
  },
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}
.btns-grop button:not(first-child) {
  margin-left: 12px;
}
.label-fix {
  display: inline-block;
  width: 50%;
  text-align: left;
  position: relative;
  top: 8px;
}
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  border: none;
}

.custom-table > .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table > .custom-table td {
  text-align: left;
}
</style>
