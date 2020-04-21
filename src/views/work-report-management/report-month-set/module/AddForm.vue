<template>
  <a-modal
    :title="modalTitle"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <div class="report-day-header">
        <h2>{{headerTitle}}</h2>
        <p style="text-align:right;">Q/XZWDF02-CP/011-A/O</p>
      </div>

      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">编号</td>
            <td style="width:300px;">
              <a-form-item>
                <span>{{reportNum || '系统自动生成'}}</span>
              </a-form-item>
            </td>
            <td>部门</td>
            <td>{{departmentName}}</td>
          </tr>
          <tr>
            <td>岗位</td>
            <td>{{stationName}}</td>
            <td>姓名</td>
            <td>{{trueName}}</td>
          </tr>
        </table>
        <h3>今日工作内容</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:150px;">序号</th>
            <th>工作内容</th>
            <th style="width:100px;">工作进度(%)</th>
            <th style="width:70px;" v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item ,index) in todayList" :key="index">
            <td style="width:150px;">{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder="输入工作内容"
                  :rows="1"
                  v-decorator="[`todayList.${index}.content`, {initialValue:todayList[index].content, rules: [{ required: false, message: '输入工作内容' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:100px;">
              <a-form-item>
                <a-input-number 
                  :disabled="isView"
                  placeholder="工作进度"
                  v-decorator="[`todayList.${index}.progress`, {initialValue:todayList[index].progress,rules: [{ required: false, message: '输入工作进度' }] }]"
                  :min="0"
                  :max="100"
                  style="width: 120px"
                />
                <span>&nbsp;%</span>
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item >
                <a href="javascript:void(0);" @click="delItem('todayList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button 
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('todayList')"
        >添加今日工作内容</a-button>
        <h3>明日工作计划</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:150px;">序号</th>
            <th>明日工作计划</th>
            <th style="width:100px;">工作进度(%)</th>
            <th style="width:70px;" v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item ,index) in planList" :key="index">
            <td style="width:150px;">{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder="输入工作内容"
                  :rows="1"
                  v-decorator="[`planList.${index}.content`, {initialValue:planList[index].content, rules: [{ required: false, message: '输入工作内容' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:100px;">
              <a-form-item>
                <a-input-number 
                  :disabled="isView"
                  placeholder="工作进度"
                  v-decorator="[`planList.${index}.progress`, {initialValue:planList[index].progress,rules: [{ required: false, message: '输入工作进度' }] }]"
                  :min="0"
                  :max="100"
                  style="width: 120px"
                />
                <span>&nbsp;%</span>
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item >
                <a href="javascript:void(0);" @click="delItem('planList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button 
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('planList')"
        >添加明日工作计划</a-button>
        <table class="custom-table custom-table-border" style="margin:20px 0 0 0;">
          <tr>
            <th style="width:150px;">附件</th>
            <td style="text-align:left;">
              <div class="clearfix">
                <a-upload
                  name="file"
                  :action="uploadPath"
                  :multiple="true"
                  :fileList="fileList"
                  @change="handleChange"
                >
                  <a-button type="dashed" icon="upload" v-if="!isView">上传文件</a-button>
                </a-upload>
              </div>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { workReportSetMonthDetail, workReportSetMonthSaveAndUpdate } from '@/api/workReportManagement'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'AddForm',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: 'view',
      departmentName: undefined,
      stationName: undefined,
      trueName: undefined,
      reportNum:undefined,
      record:{},
      todayList: [],
      planList: [],
      uploadPath: getUploadPath2(),
      fileList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    modalTitle() {
      return '新增'
    },
    headerTitle() {
      if(this.isAdd){
        let depName = this.departmentName
        let _date = moment().format('YYYY年MM月')
        let _type = '月报'
        return `${depName}${_date}${_type}`
      }else{
        
        let depName = this.record.departmentName
        let _date = moment(this.record.createdTime).format('YYYY年MM月')
        let _type = '月报'
        return `${depName}${_date}${_type}`
      }
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    }
  },
  methods: {
    addItem(key) {
      this[key].push({
        content: undefined,
        progress: undefined
      })
    },
    delItem(key, index) {
      let _d = [...this[key]]
      _d.splice(index, 1)
      this[key] = [..._d]
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      console.log(that)
      that.record = Object.assign({}, record)
      that.form.resetFields()
      await that.initData()

      if (that.isView || that.isEdit) {
        workReportSetMonthDetail({ id: that.record.id }).then(res => {
          that.fillData(res.data)
        })
      } else {
        that.departmentName = that.userInfo.departmentName
        that.stationName = that.userInfo.stationName
        that.trueName = that.userInfo.trueName
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async fillData(resultData) {
      let that = this

      that.reportNum = resultData.dailyNum
      that.departmentName = resultData.departmentName
      that.stationName = resultData.stationName
      that.trueName = resultData.userName
      that.todayList = resultData.todayList || []
      that.planList = resultData.planList || []
      if(Array.isArray(resultData.annexList)){
        that.fileList = resultData.annexList.map((item,index) => {
          return {
            uid: String(index + 1),
            name: item.workUrl,
            status: 'done',
            url: item.workUrl
          }
        })
      }
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          let _values = {}
          let { todayList, planList } = values
          todayList = todayList.map((item, index) => {
            item.orderNum = index + 1
            return item
          })

          planList = planList.map((item, index) => {
            item.orderNum = index + 1
            return item
          })
          let annexList = that.fileList.map((item, index) => {
            return {
              orderNum: index + 1,
              workUrl: item.url
            }
          })

          // _values.dailyNum = ''
          // _values.departmentId = ''
          // _values.stationId = ''

          _values.todayList = todayList
          _values.planList = planList
          _values.annexList = annexList

          if (that.isEdit) {
            _values.id = that.record.id
          }
          that.spinning = true
          workReportSetMonthSaveAndUpdate(_values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.todayList = []
      this.planList = []
      this.fileList = []
      this.$nextTick(() => (this.visible = false))
    },
    handleChange(info) {
      console.log(arguments)
      let fileList = [...info.fileList]
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    }
  }
}
</script>
<style scoped>
.report-day-header h2 {
  text-align: center;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
