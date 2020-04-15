<template>
  <a-modal
    :title="tableTitle"
    :width="1000"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    v-model="visible"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!--span:在屏幕中的占比，offset：距离左边距离，lg大屏，md中屏，sm小屏-->
        <!--span:在屏幕中的占比，labelCol:标签文字样式，wrapperCol:标签内容样式，offset：距离左边距离，lg大屏，md中屏，sm小屏-->
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="客户名称:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ event.customerName }}
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="紧急程度:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <span v-if="event.urgencyLevel === 1">特提</span>
              <span v-if="event.urgencyLevel === 2">特急</span>
              <span v-if="event.urgencyLevel === 3">加急</span>
              <span v-if="event.urgencyLevel === 4">平急</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="主板号:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ event.mainboardId }}
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="产品名称:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ event.productName }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="生产日期:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ event.productionDate }}
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="故障数量/该批次总数:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ event.faultCount }} / {{ event.batchCount }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="故障设备具体位置:" :labelCol="singleLabel" :wrapperCol="singleWrapper">
              {{ event.faultPosition }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="事件描述:" :labelCol="singleLabel" :wrapperCol="singleWrapper">
              <a-textarea 
                read-only="read-only" 
                v-decorator="['eventDescription',{initialValue: event.eventDescription}]" 
                :autosize="{ minRows: 4, maxRows: 6 }" 
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 分配负责人 -->
        <a-row v-if="subType == 'allocation'" class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="选择负责部门:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="选择负责部门" v-decorator="['depSelect',{rules: [{required: true, message: '请选择负责部门！'}]}]">
                <a-select-option @click="chooseDep(dep)" v-for="dep in depManegerList" :key="dep.index" :value="dep.responsibleDep">{{ dep.depName }}-{{ dep.responsibleName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="已选责部门:" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ choosedDepName }}
            </a-form-item>
          </a-col>
        </a-row>
        <template v-if="event.principals != undefined && event.principals.length > 0">
          <a-divider>负责人及解决方案</a-divider>
        </template>
        <!-- 循环输出解决方案 -->
        <template v-for="prcl in event.principals">
          <!-- 解决事件的时候 -->
          <template v-if="subType === 'solve'">
            <a-row :key="prcl.index" class="form-row" :gutter="24">
              <a-col :lg="24" :md="24" :sm="24">
                <a-form-item label="负责部门及负责人:" :labelCol="singleLabel" :wrapperCol="singleWrapper">
                  {{ prcl.depName }} - {{ prcl.responsibleName }};
                  <template v-if="prcl.isSolved === 1">
                    <a @click="$refs.solutionForm.show(prcl)">查看详情</a>
                  </template>
                  <template v-else>
                    (未解决)
                  </template>
                </a-form-item>
              </a-col>
            </a-row>
            <template v-if="user.id === prcl.responsibleUser && prcl.isSolved !== 1">
              <a-row :key="prcl.index" class="form-row" :gutter="24">
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item label="你的解决方案:" :labelCol="singleLabel" :wrapperCol="singleWrapper">
                    <a-textarea style="width: 80%" placeholder="请输入解决方案" v-decorator="['solution',{rules: [{required: true, min: 5, message: '解决方案最少为5个字符！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :key="prcl.index" class="form-row" :gutter="24">
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item label="负责人罚款金额:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input read-only="read-only" v-decorator="['penaltyAmount']"/>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <b style="color:red">负责人罚款金额为主责任人的80%</b>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :key="prcl.index" class="form-row" :gutter="24">
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item label="选择责任人部门:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="请选择责任人部门">
                      <a-select-option @click="choosePerson(dep.id)" v-for="dep in allDep" :key="dep.index" :value="dep.id">{{ dep.departmentName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item label="选择责任人:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="请选择责任人" v-decorator="['selectPerson']">
                      <a-select-option @click="addPerson(depUser)" v-for="depUser in depUsers" :key="depUser.index" :value="depUser.id">{{ depUser.trueName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-for="owner in owners" class="form-row" :gutter="24">
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item label="责任人:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    {{ owner.trueName }}  <a-divider type="vertical"/><b>是否为主责任人:</b>
                    <a-radio-group @change="clickMain" v-decorator="['isMain-'+owner.id,{initialValue: 0}]">
                      <a-radio @click="setAmount(owner.id,2)" :disabled="haveMain" :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item label="罚款金额:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input @blur="setAmount(owner.id,1)" v-decorator="['penaltyAmount-'+owner.id,{rules: [{required: true, min: 1,pattern: '^[0-9]*$', message: '罚款金额必须为数字且不可为空！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
          </template>
          <template v-else> <!-- 处罚或者结案事件的时候 -->
            <a-row :key="prcl.index" class="form-row" :gutter="24">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{ prcl.depName }} - {{ prcl.responsibleName }}
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <template v-if="prcl.isSolved === 1">
                    <a @click="$refs.solutionForm.show(prcl)">查看详情</a>
                  </template>
                  <template v-else>
                    (未解决)
                  </template>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </template>
        <template v-if="event.status >= 4">
          <a-row class="form-row" :gutter="24">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                质量主管的解决方案
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a @click="$refs.punishForm.show(event.id, 2)">查看详情</a>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template v-if="event.status === 5">
          <a-row class="form-row" :gutter="24">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                董事长的解决方案
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a @click="$refs.punishForm.show(event.id, 3)">查看详情</a>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template v-if="subType === 'punish'">
          <a-button type="primary" @click="$refs.doPunishForm.show(event.id, 1)">处罚</a-button>
        </template>
        <template v-if="subType === 'closing'">
          <a-button type="primary" @click="$refs.doPunishForm.show(event.id, 2)">结案</a-button>
        </template>
      </a-form>
    </a-spin>
    <solution-form ref="solutionForm"/>
    <punish-form ref="punishForm"/>
    <do-punish-form ref="doPunishForm" @ok="handleCancel"/>
  </a-modal>
</template>
<script>
import { savePrincipal, solveEvent, getDepManager, getProductByMainboard } from '@/api/production/event'
import { getUserListNoPage } from '@/api/systemSetting'
import SolutionForm from './SolutionForm'
import PunishForm from './PunishForm'
import DoPunishForm from './DoPunishForm'
export default {
  name: 'EventForm',
  props: {
    allDep: { required: true, type: Array }
  },
  components: { // 组件
    SolutionForm,
    PunishForm,
    DoPunishForm
  },
  data () {
    return {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      singleLabel: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      },
      singleWrapper: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      threeLabel: {
        xs: { span: 5 },
        sm: { span: 5 }
      },
      threeWrapper: {
        xs: { span: 15 },
        sm: { span: 15 }
      },
      event: {}, // 当前事件
      subType: '',
      choosedDep: [], // 已选部门
      choosedDepName: '', // 已选部门名字
      user: this.$store.getters.userInfo, // 当前登录人
      depUsers: [], // 部门下人员
      owners: [], // 所有已选的责任人
      haveMain: false, // 是否有主联系人了
      principal: {}, // 负责人解决事件的时候当前负责人
      depManegerList: [], // 所有部门和部门领导人的集合
      visible: false,
      confirmLoading: false, // 加载图标
      tableTitle: '' // 表单标题
    }
  },
  mounted () { // 初始化
    getDepManager().then(res => { // 获取所有部门
      if (res.code === 200) {
        this.depManegerList = res.data
      }
    })
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    setAmount (id, type) { // 主联系人改变后改变负责人的罚款
      var isMain = this.form.getFieldValue('isMain-' + id)
      if ((isMain === 1 && type === 1) || (isMain === 0 && type === 2)) {
        var pAmount = this.form.getFieldValue('penaltyAmount-' + id)
        var a = pAmount * 0.8
        this.form.setFieldsValue({ penaltyAmount: a.toFixed(2) })
      }
    },
    chooseDep (dep) { // 选择部门
      const depUser = { responsibleDep: dep.responsibleDep, responsibleUser: dep.responsibleUser }
      this.choosedDep.push(depUser)
      if (this.choosedDepName !== undefined && this.choosedDepName !== '' && this.choosedDepName.length > 0) {
        this.choosedDepName += ',' + dep.depName + '-' + dep.responsibleName
      } else {
        this.choosedDepName += dep.depName + '-' + dep.responsibleName
      }
    },
    choosePerson (depId) { // 选择负责人部门
      getUserListNoPage({ departmentId: depId }).then(res => {
        if (res.code === 200) {
          this.depUsers = res.data
        }
      })
    },
    addPerson (user) { // 选择负责人
      for (var i = 0; i < this.owners.length; i++) {
        if (user === this.owners[i]) {
          this.$message.error('不可选择重复的责任人！')
          return false
        }
      }
      this.owners.push(user)
    },
    clickMain (e) { // 选择主联系人
      var type = e.target.value
      if (type === 1) {
        this.haveMain = true
      } else {
        if (this.haveMain === true) {
          this.haveMain = false
        }
      }
    },
    show (event, type) {
      this.event = event
      this.subType = type
      const mainboardId = event.mainboardId
      if (mainboardId != null && mainboardId != undefined && mainboardId.length > 0) {
        getProductByMainboard({ mainboardId: mainboardId }).then(res => {
          if (res.code === 200) {
            this.$set(this.event, 'batchCount', res.data.batchCount)
            this.$set(this.event, 'productName', res.data.productName)
            this.$set(this.event, 'productionDate', res.data.productionDate)
          }
        })
      }
      if (type === 'allocation') {
        this.tableTitle = '分配事件'
      } else if (type === 'solve') {
        this.tableTitle = '解决事件'
        const principals = event.principals
        for (var i = 0; i < principals.length; i++) {
          if (this.user.id === principals[i].responsibleUser) {
            this.principal = principals[i]
          }
        }
      } else if (type === 'punish') {
        this.tableTitle = '处罚事件'
      } else if (type === 'closing') {
        this.tableTitle = '结案事件'
        this.subType = type
      } else if (type === 'detail') {
        this.tableTitle = '事件详情'
      }
      this.visible = true
    },
    handleOk () { // 提交
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          this.confirmLoading = true
          if (this.subType === 'allocation') { // 分配
            if (this.choosedDep === undefined || this.choosedDep.length === 0) {
              this.form.setFields({ 'depSelect': { errors: [{ 'message': '请选择负责人' }] } })
            }
            const param = { eventId: this.event.id, principals: this.choosedDep }
            savePrincipal(param).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')
                this.$message.success('保存成功')
              } else {
                this.$message.error(res.msg)
              }
            })
          } else if (this.subType === 'solve') { // 解决
            const pId = this.principal.id
            const rbs = [] // 所有的责任人
            if (this.owners === undefined || this.owners.length === 0) {
              this.form.setFields({ 'selectPerson': { errors: [{ 'message': '请选择责任人!', 'field': 'selectDep' }] } })
              this.confirmLoading = false
              return false
            }
            if (!this.haveMain) {
              this.form.setFields({ 'selectPerson': { errors: [{ 'message': '必须有一位主责任人!', 'field': 'selectDep' }] } })
              this.confirmLoading = false
              return false
            }
            for (var i = 0; i < this.owners.length; i++) {
              var user = this.owners[i]
              var pAmount = this.form.getFieldValue('penaltyAmount-' + user.id)
              var isMain = this.form.getFieldValue('isMain-' + user.id)
              const responsible = { principalId: pId, dutyUser: user.id, penaltyAmount: pAmount, isMain: isMain }
              rbs.push(responsible)
            }
            var penaltyAmount = this.form.getFieldValue('penaltyAmount') // 负责人的罚款金额
            var solution = this.form.getFieldValue('solution') // 负责人的解决方案
            this.$set(this.principal, 'penaltyAmount', penaltyAmount)
            this.$set(this.principal, 'responsibles', rbs)
            this.$set(this.principal, 'solution', solution)
            solveEvent(this.principal).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')
                this.$message.success('保存成功')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          this.handleCancel()
          this.confirmLoading = false
        }
      })
    },
    handleCancel () { // 关闭页面
      this.event = {} // 当前事件
      this.subType = ''
      this.choosedDep = [] // 已选部门
      this.choosedDepName = '' // 已选部门名字
      this.depUsers = [] // 部门下人员
      this.owners = [] // 所有已选的责任人
      this.haveMain = false // 是否有主联系人了
      this.principal = {} // 当前负责人
      this.visible = false
      this.form.resetFields()
      this.$emit('ok')
    }
  }
}
</script>
<style scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-form-item-label{
    text-align: left;
  }
</style>
