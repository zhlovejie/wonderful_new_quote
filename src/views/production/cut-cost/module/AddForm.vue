<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction" >不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id']" />
          <a-input v-decorator="['instanceId']" />
        </a-form-item>
        <h3>原产品信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">原物料代码</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['quondamCode', { rules: [{ required: true, message: '输入原物料代码' }] }]"
                />
              </a-form-item>
            </td>
            <td class="wdf-column">原产品名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['quondamName', { rules: [{ required: true, message: '输入原产品名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">原品牌</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['quondamBrand', { rules: [{ required: true, message: '输入原品牌' }] }]"
                />
              </a-form-item>
            </td>
            <td class="wdf-column">原价格(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  :disabled="isDisabled"
                  v-decorator="['quondamPrice', { rules: [{ required: true, message: '输入原价格' }]}]"
                  @change="priceChange"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="wdf-column">库存数量</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :disabled="isDisabled"
                  v-decorator="['inventoryNum', { rules: [{ required: true, message: '输入库存数量' }]}]"
                />
              </a-form-item>
            </td>
            <td rowspan="2">图片</td>
            <td rowspan="2">
              <template v-if="isDisabled">
                <img
                  :src="detail.quondamPicture"
                  style="width:auto;height:auto; max-width:160px;overflow:hidden;"
                  alt
                />
              </template>
              <template v-else>
                <UploadFile key="oldPic" ref="oldPic" />
              </template>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">采购渠道</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['quondamChannel', { rules: [{ required: false, message: '输入采购渠道' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder
                  :rows="2"
                  :disabled="isDisabled"
                  v-decorator="['quondamRemark', {initialValue:'', rules: [{ required: false, message: '输入备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>现产品信息</h3>
        <table class="custom-table custom-table-border">
          
          <tr v-if="+detail.isUsed === 1">
            <td class="wdf-column">现物料代码</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['newCode', { rules: [{ required: false, message: '现物料代码' }] }]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="wdf-column">产品名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['newName', { rules: [{ required: true, message: '输入产品名称' }] }]"
                />
              </a-form-item>
            </td>
            <td class="wdf-column">品牌</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['newBrand', { rules: [{ required: true, message: '输入品牌' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">价格(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  :disabled="isDisabled"
                  v-decorator="['newPrice', { rules: [{ required: true, message: '输入价格' }]}]"
                  @change="priceChange"
                />
              </a-form-item>
            </td>
            <td rowspan="2">图片</td>
            <td rowspan="2">
              <template v-if="isDisabled">
                <img 
                  :src="detail.newPicture"
                  style="width:auto;height:auto; max-width:160px;overflow:hidden;"
                  alt
                />
              </template>
              <template v-else>
                <UploadFile key="newPic" ref="newPic" />
              </template>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">采购渠道</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  v-decorator="['newChannel', { rules: [{ required: false, message: '输入采购渠道' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder
                  :rows="2"
                  :disabled="isDisabled"
                  v-decorator="['newRemark', {initialValue:'', rules: [{ required: false, message: '输入备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>

        <h3>降本数据</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">降价金额(元)</td>
            <td>
              <a-form-item>
                <span style="font-size:150%;color:red;">{{diffPrice | moneyFormatNumber}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">参与人员</td>
            <td colspan="3">
              <template v-if="isDisabled">
                <a-form-item>{{oaMeetingJoinUserStr}}</a-form-item>
              </template>
              <template v-else>
                <div style="display:flex;">
                  <a-form-item>
                    <a-select
                      style="width:150px;margin-right:10px;"
                      placeholder="选择部门"
                      @change="depChangeHandler1"
                    >
                      <a-select-option
                        v-for="item in depList"
                        :key="item.id"
                        :value="item.id"
                      >{{item.departmentName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select
                      style="width:150px;margin-right:10px;"
                      placeholder="选择人员"
                      @change="personChange"
                    >
                      <a-select-option
                        v-for="item in personJoinList"
                        :key="item.id"
                        :value="item.id"
                      >{{item.trueName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      type="primary"
                      style="margin-right:10px;"
                      @click="joinPersonAction('add')"
                    >添加</a-button>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="joinPersonAction('reset')">重选</a-button>
                  </a-form-item>
                </div>
                <div
                  class="join-person-wrapper"
                  style="border: 2px dashed #ddd;padding:10px 15px 15px 15px;"
                >
                  <div style="text-align:left;" v-if="oaMeetingJoinList.length > 0">
                    <a-tag
                      v-for="item in oaMeetingJoinList"
                      :key="item._key"
                      style="margin-top:7px;"
                      :closable="!item.__root"
                      :color="item.__root ? 'red' :''"
                      @close="removeTag(item)"
                    >{{item.trueName}}</a-tag>
                  </div>
                  <div v-else>暂无参与人员</div>
                </div>
              </template>
            </td>
          </tr>
        </table>
        <Approval ref="approval" @opinionChange="opinionChange" />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
//查询部门主管
import { getPositionManager } from '@/api/personnelManagement'
import { getDictionaryList } from '@/api/workBox'
import { depreciateApplyAddOrUpdate, depreciateApplyApprove, depreciateApplyDetail } from '@/api/production/cutCost'
import UploadFile from './UploadFile'
import Approval from './Approval'

function makeUUID() {
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  components: {
    UploadFile,
    Approval
  },
  data() {
    return {
      meetingAddrList: [],
      depList: [],
      personList: [],
      personJoinList: [],
      oaMeetingJoinList: [],
      currentPerson: null,
      diffPrice: 0,
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'view',
      spinning: false,
      meetingLenths: '',
      record: {},
      detail: {},
      oaMeetingJoinUserStr: '',
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    modalTitle() {
      let m = {
        view: '查看',
        add: '新增',
        edit: '修改',
        approval: '审批'
      }
      return `${m[this.actionType]}降本`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    }
  },
  methods: {
    init() {
      let that = this
      return Promise.all([
        departmentList().then(res => (that.depList = res.data)), //部门
        getDictionaryList({ parentId: 503 }).then(res => (that.meetingAddrList = res.data))
      ])
    },
    depChangeHandler(depId) {
      return getUserByDep({ departmentId: depId }).then(res => (this.personList = res.data))
    },
    depChangeHandler1(depId) {
      return getUserByDep({ departmentId: depId }).then(res => (this.personJoinList = res.data))
    },
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          //提交
          //debugger
          try {
            let oldFiles = that.$refs.oldPic.getFiles()
            if (Array.isArray(oldFiles) && oldFiles.length > 0) {
              values.quondamPicture = oldFiles[0].url
            }
            let newFiles = that.$refs.newPic.getFiles()
            if (Array.isArray(newFiles) && newFiles.length > 0) {
              values.newPicture = newFiles[0].url
            }
          } catch (err) {
            console.log(err)
          }

          values.users = that.oaMeetingJoinList.map(item => {
            return {
              userId: item.id,
              userName: item.trueName
            }
          })
          values.depreciatePrice = that.diffPrice
          console.log(values)

          //return
          that.spinning = true
          depreciateApplyAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.actionType = type
      that.record = record || {}
      that.oaMeetingJoinList = []
      await that.form.resetFields()
      await that.init()

      try{
        that.$refs.oldPic && that.$refs.oldPic.setFiles([])
        that.$refs.newPic && that.$refs.newPic.setFiles([])
      }catch(err){

      }

      if(that.isAdd){
        that.oaMeetingJoinList = [{
          _key:makeUUID(),
          id:that.userInfo.id,
          trueName:that.userInfo.trueName,
          __root:true
        }]
        return
      }
      //填充数据
      let result = await depreciateApplyDetail({ id: that.record.id })
        .then(res => res.data)
        .catch(err => null)
      if (result) {
        that.detail = {...result}
        that.diffPrice = result.depreciatePrice || 0
        that.$nextTick(() => that.form.setFieldsValue({ ...result }))

        //debugger
        that.oaMeetingJoinList = result.users.map(item => {
          return {
            _key: makeUUID(),
            id: item.userId,
            trueName: item.userName,
            __root:item.userId === that.userInfo.id,
          }
        })
        that.oaMeetingJoinUserStr = that.oaMeetingJoinList.map(item => item.trueName).join(',')

        try{
          that.isEdit && result.quondamPicture &&that.$refs.oldPic && that.$refs.oldPic.setFiles([{url:result.quondamPicture}])
          that.isEdit && result.newPicture && that.$refs.newPic && that.$refs.newPic.setFiles([{url:result.newPicture}])
        }catch(err){

        }
      }
    },
    resetValues() {
      let that = this
    },
    removeTag(item) {
      this.oaMeetingJoinList = this.oaMeetingJoinList.filter(p => p._key !== item._key)
    },
    personChange(val) {
      let target = this.personJoinList.find(item => +item.id === +val)
      if (target) {
        this.currentPerson = Object.assign({}, target)
      }
    },
    joinPersonAction(type) {
      //debugger
      let that = this
      if (type === 'add') {
        if (!that.currentPerson) {
          that.$message.info('请选择参与人员')
          return
        }
        if (that.oaMeetingJoinList.find(item => item.id === that.currentPerson.id)) {
          that.$message.info(`参与人员已包括【${that.currentPerson.trueName}】,不能重复添加`)
          return
        }
        that.oaMeetingJoinList.push(Object.assign({}, that.currentPerson, { _key: makeUUID() }))
      } else if (type === 'reset') {
        that.oaMeetingJoinList = that.oaMeetingJoinList.filter(item => item.__root)
      }
    },
    priceChange(){
      let that = this
      that.$nextTick(() => {
        let res = that.form.getFieldsValue(['quondamPrice', 'newPrice'])
        let newPrice = res['quondamPrice']
        let oldPrice = res['newPrice']
        that.diffPrice = Number(newPrice) - Number(oldPrice)
      })
    },
    submitAction(opt){
      let that = this
      let values = {
        approveId:that.record.id,
        isAdopt:opt.isAdopt,
        opinion:opt.opinion
      }
      that.spinning = true
      depreciateApplyApprove(values).then(res =>{
        that.spinning = false
        console.log(res)
        that.form.resetFields() // 清空表
        that.visible = false 
        that.$message.info(res.msg)
        that.$emit('finish')
      }).catch(err =>that.spinning = false)
    },
    passAction(){
      this.submitAction({
        isAdopt:0,
        opinion:'通过'
      })
    },
    noPassAction(){
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion){ //审批意见
      this.submitAction({
        isAdopt:1,
        opinion:opinion
      })
    },
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-column{
  width: 120px;
}
</style>
