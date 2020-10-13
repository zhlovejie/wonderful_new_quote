<template>
  <div class="content-wrap">
    <a-row type="flex">
      <a-col :span="24" class="basic-tit" justify="center" align="middle">课程安排</a-col>
    </a-row>
    <div>
      <a-form :form="form" class="form wdf-form">
        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left">类型</a-col>
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-radio-group
                  @change="authorityType"
                  :disabled="isSee"
                  v-decorator="['onlineFlag', { initialValue: 0, rules: [{ required: true, message: '请选择权限' }] }]"
                >
                  <a-radio :value="0" style="margin-right: 50px">线下</a-radio>
                  <a-radio :value="1">线上</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left"
              >会议负责人</a-col
            >
            <a-col class="col-border" :span="8" type="flex" justify="left" align="middle">
              <a-form-item style="float: right">
                <a-select
                  style="width: 160px"
                  @change="depChangeHandler"
                  :disabled="isSee"
                  placeholder="请选择部门"
                  v-decorator="['meetingDepartmentId', { rules: [{ required: true, message: '请选择部门!' }] }]"
                >
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="8" type="flex" justify="left" align="middle">
              <a-form-item style="float: left">
                <a-select
                  style="width: 160px"
                  placeholder="请选择人员"
                  :disabled="isSee"
                  v-decorator="['meetingUserId', { rules: [{ required: true, message: '请选择部门!' }] }]"
                >
                  <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left"
              >开始时间</a-col
            >
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-date-picker
                  :disabled="isSee"
                  style="width: 60%"
                  @change="dateChange"
                  v-decorator="['beginTime', { rules: [{ required: true, message: '请输入开始时间' }] }]"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left"
              >结束时间</a-col
            >
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-date-picker
                  :disabled="isSee"
                  @change="dateChange"
                  style="width: 60%"
                  v-decorator="['endTime', { rules: [{ required: true, message: '请输入结束时间' }] }]"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="jurisdiction">
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left">讲师</a-col>
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  style="width: 60%"
                  :precision="0"
                  placeholder="输入讲师"
                  v-decorator="['lecturerUserName', { rules: [{ required: false, message: '请输入讲师' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="jurisdiction">
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left">地点</a-col>
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-select
                  :disabled="isSee"
                  style="width: 60%"
                  placeholder="请选择地点"
                  v-decorator="['meetingDicId', { rules: [{ required: false, message: '请选择地点!' }] }]"
                >
                  <a-select-option v-for="item in settlement" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item v-if="jurisdiction">
          <a-row type="flex">
            <a-col class="col-border" :span="5" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle" style="text-align: left"
              >有无考核</a-col
            >
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-radio-group
                  :disabled="isSee"
                  v-decorator="[
                    'haveCheckFlag',
                    { initialValue: 0, rules: [{ required: false, message: '请选择权限' }] },
                  ]"
                >
                  <a-radio :value="0" style="margin-right: 50px">无</a-radio>
                  <a-radio :value="1">有</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <div class="btns-grop">
            <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
            <a-button type="primary" @click="nextStep">下一步</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getDictionaryList } from '@/api/workBox' // 数据字典
import { getDevisionList } from '@/api/systemSetting'
import { queryList } from '@/api/humanResources'
import moment from 'moment'
export default {
  name: 'Step1',
  props: {
    queryonedata: {
      type: Object,
    },
    type: '',
  },
  data() {
    return {
      departmentList: [], //部门
      postSelectDataSource: [], //人员
      settlement: [], //数据字典地点
      form: this.$form.createForm(this),
      loading: false,
      type1: '',
      queryonedata1: {},
      isSee: false,
      jurisdiction: true,
    }
  },
  computed: {},
  watch: {
    queryonedata(val) {
      this.queryonedata1 = val

      this.quweyData()
      if (this.type1 === 'view' || this.type1 === 'examine') {
        this.isSee = true
      }
    },
    type(val) {
      this.type1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
    this.type1 = this.type
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
    getDictionaryList({ parentId: 503 }).then((res) => {
      this.settlement = res.data
    })
    if (this.type1 === 'view' || this.type1 === 'examine') {
      this.isSee = true
      queryList({ departmentId: this.queryonedata1.meetingDepartmentId }).then((res) => {
        this.postSelectDataSource = res.data
      })
    }
  },
  mounted() {
    this.quweyData()
  },
  methods: {
    moment,
    dateChange() {
      let that = this
      that.$nextTick(() => {
        let { beginTime, endTime } = that.form.getFieldsValue(['beginTime', 'endTime'])
        if (beginTime > endTime) {
          that.$message.info('结束时间必须大于开始时间')
          that.form.setFieldsValue({ endTime: undefined })
          return
        }
        if (beginTime instanceof moment && endTime instanceof moment) {
          let s = moment(beginTime.format('YYYY-MM-DD'))
          let e = moment(endTime.format('YYYY-MM-DD'))
          that.diffDate = e.diff(s, 'days') + 1
        }
      })
    },
    //选择人员
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    //讲师 地址 有无考核 显示隐藏
    authorityType(author) {
      let that = this

      if (author.target.value === 1) {
        that.jurisdiction = false
      } else {
        that.jurisdiction = true
      }
    },
    quweyData() {
      let qt = this.queryonedata1 ? this.queryonedata1 : {}
      if (qt.meetingDepartmentId) {
        queryList({ departmentId: qt.meetingDepartmentId }).then((res) => {
          this.postSelectDataSource = res.data
        })
        if (qt.onlineFlag === 1) {
          this.jurisdiction = false
        }
        this.form.setFieldsValue({
          beginTime: moment(qt.beginTime),
          endTime: moment(qt.endTime),
          haveCheckFlag: qt.haveCheckFlag,
          meetingDepartmentId: qt.meetingDepartmentId,
          meetingUserId: qt.meetingUserId,
          lecturerUserName: qt.lecturerUserName,
          meetingDicId: qt.meetingDicId,
          onlineFlag: qt.onlineFlag,
        })
      }
    },
    //上一步
    prevStep() {
      let that = this
      that.$emit('prevStep')
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this

      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          values.beginTime = moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss')
          values.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss')
          that.$emit('nextStep', { ...values })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.wdf-row {
  // border: 1px solid #ddd;
}
.col-border {
  // border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.col-border ~ .col-border {
  border-left: none;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
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
</style>
