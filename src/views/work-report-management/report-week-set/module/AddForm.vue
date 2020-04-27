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
              <span>{{reportNum || '系统自动生成'}}</span>
            </td>
            <td>部门</td>
            <td>{{departmentName}}</td>
          </tr>
          <tr>
            <td>岗位</td>
            <td>{{stationName}}</td>
            <td>汇报人</td>
            <td>{{trueName}}</td>
          </tr>
        </table>
        <h3>本周工作完成情况总结</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:150px;">序号</th>
            <th>
              <i class="wdf-required"></i> 主要工作内容
            </th>
            <th style="width:100px;">
              <i class="wdf-required"></i> 实际完成情况(%)
            </th>
            <th style="width:180px;">未完成原因</th>
            <th style="width:180px;">对策</th>
            <th style="width:70px;" v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item ,index) in finishList" :key="index">
            <td style="width:150px;">{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`finishList.${index}.mainContent`, {initialValue:finishList[index].mainContent, rules: [{ required: true, message: '输入主要工作内容' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:100px;">
              <a-form-item>
                <a-input-number
                  :disabled="isView"
                  placeholder=""
                  v-decorator="[`finishList.${index}.finishDesc`, {initialValue:finishList[index].finishDesc,rules: [{ required: true, message: '输入实际完成情况' }] }]"
                  :min="0"
                  :max="100"
                  style="width: 120px"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`finishList.${index}.noFinishReason`, {initialValue:finishList[index].noFinishReason, rules: [{ required: false, message: '输入未完成原因' }] }]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`finishList.${index}.solution`, {initialValue:finishList[index].solution, rules: [{ required: false, message: '输入对策' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('finishList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('finishList')"
        >添加工作完成情况</a-button>

        <h3>本周部门发生重大异常汇总</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:150px;">序号</th>
            <th>重大异常</th>
            <th style="width:70px;" v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item ,index) in exceptionList" :key="index">
            <td style="width:150px;">{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`exceptionList.${index}.content`, {initialValue:exceptionList[index].content, rules: [{ required: false, message: '输入重大异常内容' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('exceptionList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('exceptionList')"
        >添加部门发生重大异常</a-button>

        <h3>需要解决问题及建议</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:150px;">序号</th>
            <th>问题&建议</th>
            <th style="width:70px;" v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item ,index) in adviseList" :key="index">
            <td style="width:150px;">{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`adviseList.${index}.mainContent`, {initialValue:adviseList[index].mainContent, rules: [{ required: false, message: '输入问题&建议' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('adviseList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('adviseList')"
        >添加问题及建议</a-button>

        <h3>下周工作计划</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:150px;">序号</th>
            <th>
              <i class="wdf-required"></i>主要工作内容
            </th>
            <th style="width:100px;">
              <i class="wdf-required"></i>计划完成时间
            </th>
            <th style="width:180px;">配合部门</th>
            <th style="width:180px;">备注</th>
            <th style="width:70px;" v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item ,index) in planList" :key="index">
            <td style="width:150px;">{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`planList.${index}.mainContent`, {initialValue:planList[index].mainContent, rules: [{ required: true, message: '输入主要工作内容' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:100px;">
              <a-form-item>
                <a-date-picker
                  :disabled="isView"
                  placeholder=""
                  v-decorator="[`planList.${index}.finishDate`, {initialValue:planList[index].finishDate,rules: [{ required: true, message: '输入计划完成时间' }] }]"
                  style="width: 120px"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`planList.${index}.cooperateDepartment`, {initialValue:planList[index].cooperateDepartment, rules: [{ required: false, message: '输入配合部门' }] }]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="1"
                  v-decorator="[`planList.${index}.remark`, {initialValue:planList[index].remark, rules: [{ required: false, message: '输入备注' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
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
        >添加下周工作计划</a-button>

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
import { workReportSetWeekDetail, workReportSetWeekSaveAndUpdate } from '@/api/workReportManagement'
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
      reportNum: undefined,
      record: {},

      finishList: [],
      exceptionList: [],
      adviseList: [],
      planList: [],

      uploadPath: getUploadPath2(),
      fileList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    modalTitle() {
      return `${this.isView ? '查看' : (this.isAdd ? '新增' : '编辑')}周报`
    },
    headerTitle() {
      if (this.isAdd) {
        let depName = this.departmentName
        let _date = moment().format('YYYY年MM月')

        // moment.updateLocale("en", { week: {
        //   dow: 1, // 星期的第一天是星期一
        //   doy: 7  // 年份的第一周必须包含1月1日 (7 + 1 - 1)
        // }})
        let _week = moment().week()
        let _type = '周报'
        return `${depName}${_date}第${_week}周${_type}`
      } else {
        let depName = this.record.departmentName
        let _date = moment(this.record.createdTime).format('YYYY年MM月')
        let _week = moment().week()
        let _type = '周报'
        return `${depName}${_date}第${_week}周${_type}`
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
    moment,
    addItem(key, count = 1) {
      for (let i = 0, len = parseInt(count, 10) || 1; i < len; i++) {
        this[key].push({})
      }
    },
    delItem(key, index) {
      let _d = [...this[key]]
      _d.splice(index, 1)
      this[key] = [..._d]
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.dataReset()
      that.type = type
      console.log(that)
      that.record = Object.assign({}, record)
      that.form.resetFields()
      await that.initData()

      if (that.isView || that.isEdit) {
        workReportSetWeekDetail({ id: that.record.id }).then(res => {
          that.fillData(res.data)
        })
      } else {
        that.departmentName = that.userInfo.departmentName
        that.stationName = that.userInfo.stationName
        that.trueName = that.userInfo.trueName

        that.addItem('finishList', 3)
        that.addItem('exceptionList')
        that.addItem('adviseList')
        that.addItem('planList')
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async fillData(resultData) {
      let that = this

      that.reportNum = resultData.weekNum
      that.departmentName = resultData.departmentName
      that.stationName = resultData.stationName
      that.trueName = resultData.userName

      that.finishList = resultData.finishList || []
      that.exceptionList = resultData.exceptionList || []
      that.adviseList = resultData.adviseList || []
      that.planList = (resultData.planList || []).map(item => {
        item.finishDate = item.finishDate ? that.moment(item.finishDate) : undefined
        return item
      })

      if (Array.isArray(resultData.annexList)) {
        that.fileList = resultData.annexList.map((item, index) => {
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
      if(that.isView){
        that.handleCancel()
        return
      }
      if (that.finishList.length === 0) {
        that.$message.info('请填写本周工作完成情况')
        return
      }
      if (that.planList.length === 0) {
        that.$message.info('请填写下周工作计划')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          Object.keys(values).map(key => {
            let target = values[key]
            Array.isArray(target) &&
              target.map((item, index) => {
                item.orderNum = index + 1
              })
          })
          values.annexList = that.fileList.map((item, index) => {
            return {
              orderNum: index + 1,
              workUrl: item.url
            }
          })
          if (that.isEdit) {
            values.id = that.record.id
          }
          that.spinning = true
          workReportSetWeekSaveAndUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success(res.msg || '操作成功')
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
      this.dataReset()
      this.$nextTick(() => (this.visible = false))
    },
    dataReset() {
      this.form.resetFields()
      this.finishList = []
      this.exceptionList = []
      this.adviseList = []
      this.planList = []
      this.fileList = []
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
i.wdf-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  font-style: normal;
  line-height: 1;
  content: '*';
}
</style>
