<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
  <a-spin :spinning="spinning">
    <a-form :form="form" class="do_entry_form-wrapper">
      <h3>基本信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td >姓名</td>
          <td >
            <a-form-item>
              <a-input
                :disabled="isView"
                v-decorator="['trueName', { rules: [{ required: true, message: '请输入姓名' },{max:20,message:'最多可输入20个字符'}] }]"
              />
            </a-form-item>
          </td>
          <td>性别</td>
          <td >
            <a-form-item>
              <a-select
                :disabled="isView"
                v-decorator="['sex',{initialValue:0,rules: [{required: false,message: '选择性别'}]}]" placeholder="选择性别">
                <a-select-option :value="1">男</a-select-option>
                <a-select-option :value="0">女</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td>籍贯</td>
          <td>
            <a-form-item >
              <a-cascader :disabled="isView"
                v-decorator="['birthplace',{rules: [{required: false,message: '输入籍贯'}]}]"
                :options="birthplaceOptions"
                @change="birthplaceCascaderChange"
                :loadData="birthplaceCascaderLoadData"
                placeholder="输入籍贯"
              />
            </a-form-item>
          </td>
        </tr>
        <tr>
          
          <td>身份证号</td>
          <td>
            <a-form-item>
              <a-input 
              :disabled="isView" 
              @blur="validateIdentityCard"  
              v-decorator="['identityCard',{rules: [{required: true,message: '输入身份证号'}]}]" 
              placeholder="输入身份证号"
            />
            </a-form-item>
          </td>
          <td title="根据身份证号码自动填充出生日期">出生日期</td>
          <td title="根据身份证号码自动填充出生日期">
            <a-form-item>
              <a-date-picker
                disabled
                style="width:100%;"
                v-decorator="['birthDate',{rules: [{required: false,message: '输入出生日期'}]}]"
                format="YYYY-MM-DD" 
                title="根据身份证号码自动填充出生日期"
              />
            </a-form-item>
          </td>
          <td>政治面貌</td>
          <td>
            <a-form-item>
              <a-select :disabled="isView" v-decorator="['politicsStatus',{initialValue:0,rules: [{required: false,message: '选择政治面貌'}]}]" placeholder="选择政治面貌">
                <a-select-option :value="0">无</a-select-option>
                <a-select-option :value="1">团员</a-select-option>
                <a-select-option :value="2">党员</a-select-option>
              </a-select>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>婚姻状况</td>
          <td>
            <a-form-item>
              <a-select :disabled="isView" v-decorator="['maritalStatus',{initialValue:0,rules: [{required: false,message: '选择政治面貌'}]}]" placeholder="选择政治面貌">
                <a-select-option :value="0">未婚</a-select-option>
                <a-select-option :value="1">已婚</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td>生育状况</td>
          <td>
            <a-form-item>
              <a-select :disabled="isView" v-decorator="['fertilityStatus',{initialValue:0,rules: [{required: false,message: '选择生育状况'}]}]" placeholder="选择生育状况">
                <a-select-option :value="0">未育</a-select-option>
                <a-select-option :value="1">已育</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td>文化程度</td>
          <td>
            <a-form-item >
              <a-select :disabled="isView" v-decorator="['educationId',{rules: [{required: false,message: '选择文化程度'}]}]" placeholder="选择文化程度">
                <a-select-option v-for="(item, index) in education" :key="index" :value="item.id">{{item.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </td>
        </tr>


        <tr>
          <td>毕业院校</td>
          <td>
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['school',{rules: [{required: false,message: '输入毕业院校'},{max:30,message:'最多可输入30个字符'}]}]" placeholder="输入毕业院校"/>
            </a-form-item>
          </td>
          <td>专业</td>
          <td>
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['major',{rules: [{required: false,message: '输入专业'},{max:30,message:'最多可输入30个字符'}]}]" placeholder="输入专业"/>
            </a-form-item>
          </td>
          <td>工作年限</td>
          <td>
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['workingLife',{rules: [{required: false,message: '输入工作年限'}]}]" placeholder="输入工作年限"/>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>紧急联系人</td>
          <td colspan="2">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['emergencyContact',{rules: [{required: true,message: '输入紧急联系人'},{max:20,message:'最多可输入20个字符'}]}]" placeholder="输入紧急联系人"/>
            </a-form-item>
          </td>
          <td>紧急联系电话</td>
          <td colspan="2">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['emergencyTelephone',{rules: [{required: true,message: '输入紧急联系电话'},{pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}]" placeholder="输入紧急联系电话"/>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>手机(私)</td>
          <td colspan="2">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['privateMobile',{rules: [{required: true,message: '输入手机'},{pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}]" placeholder="输入手机"/>
            </a-form-item>
          </td>
          <td>QQ(私)</td>
          <td colspan="2">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['privateQqNum',{rules: [{required: false,message: '输入QQ'},{max:30,message:'最多可输入30个字符'}]}]" placeholder="输入QQ"/>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>微信(私)</td>
          <td colspan="2">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['privateWxNum',{rules: [{required: false,message: '输入微信'},{max:30,message:'最多可输入30个字符'}]}]" placeholder="输入微信"/>
            </a-form-item>
          </td>
          <td>邮箱(私)</td>
          <td colspan="2">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['privateEmail',{rules: [{required: false,message: '输入邮箱'},{pattern:/^[0-9a-z]+\w*@([0-9a-z]+\.)+[0-9a-z]+$/,message:'请填写正确电子邮箱'},{max:50,message:'最多可输入50个字符'}]}]" placeholder="输入邮箱"/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>现居住地</td>
          <td colspan="5">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['nowAbode',{rules: [{required: true,message: '输入现居住地'},{max:50,message:'最多可输入50个字符'}]}]" placeholder="输入现居住地"/>
            </a-form-item>
          </td>
        </tr>



      </table>

      <h3>职工信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td>工号</td>
          <td>
            <a-form-item>
              <a-input :disabled="isView || isRuzhi" v-decorator="['jobNum',{rules: [{required: false,message: '输入工号'}]}]" placeholder="输入工号"/>
            </a-form-item>
          </td>
          <td>照片</td>
          <td>
            <a-form-item>
              <a-input disabled type="hidden" v-decorator="['faceCode',{rules: [{required: false,message: '输入人脸识别号'}]}]" placeholder="输入人脸识别号"/>
            </a-form-item>
            <a-form-item >
              <div class="clearfix">
                <a-upload
                  :disabled="isView"
                  accept="multiple"
                  name="files"
                  :action="this.uploadPath"
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">选择图片</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" :maskClosable="false">
                  <img alt="图片" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
              <a-input type="hidden" v-decorator="['headUrl']"/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>部门</td>
          <td>
            <a-form-item>
              <a-select :disabled="isView" @change="departmentChange" v-decorator="['departmentId',{rules: [{required: true,message: '选择部门'}]}]" placeholder="选择部门">
                <a-select-option v-for="(item, index) in departmentDataSource" :key="index" :value="item.id">{{item.departmentName}}</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td>岗位</td>
          <td>
            <a-form-item>
              <a-select :disabled="isView" v-decorator="['stationId',{rules: [{required: true,message: '选择岗位'}]}]" placeholder="选择岗位">
                <a-select-option v-for="(item, index) in stationDataSource" :key="index" :value="item.id">{{item.stationName}}</a-select-option>
              </a-select>
            </a-form-item>
          </td>
        </tr>
        <tr >
          <td v-if="stationInfoRequire.mobile">手机(公)</td>
          <td v-if="stationInfoRequire.mobile">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['mobile',{rules: [{required: false,message: '输入手机'},{pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}]" placeholder="输入手机"/>
            </a-form-item>
          </td>
          <td v-if="stationInfoRequire.qqNum">QQ(公)</td>
          <td v-if="stationInfoRequire.qqNum">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['qqNum',{rules: [{required: false,message: '输入QQ'},{max:30,message:'最多可输入30个字符'}]}]" placeholder="输入QQ"/>
            </a-form-item>
          </td>
        </tr>

        <tr >
          <td v-if="stationInfoRequire.wxNum">微信(公)</td>
          <td v-if="stationInfoRequire.wxNum">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['wxNum',{rules: [{required: false,message: '输入微信'},{max:30,message:'最多可输入30个字符'}]}]" placeholder="输入微信"/>
            </a-form-item>
          </td>
          <td v-if="stationInfoRequire.email">邮箱(公)</td>
          <td v-if="stationInfoRequire.email">
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['email',{rules: [{required: false,message: '输入邮箱'},{pattern:/^[0-9a-z]+\w*@([0-9a-z]+\.)+[0-9a-z]+$/,message:'请填写正确电子邮箱'},{max:50,message:'最多可输入50个字符'}]}]" placeholder="输入邮箱"/>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>银行卡</td>
          <td colspan="3">
            <BankChoice ref="bankChoice" :bankInfo="bankInfo" :disabled="isView"/>
          </td>
        </tr>

        <tr>
          <td>车牌号</td>
          <td colspan="3" style="padding:0;">
            <table class="custom-table custom-table-border" style="margin:-1px;" >
              <tr>
                <td>常用</td>
                <td>
                  <a-form-item>
                    <a-input :disabled="isView"  v-decorator="['licensePlateNum',{rules: [{required: false,message: '输入常用车牌号'},{max:10,message:'最多可输入10个字符'}]}]" placeholder="输入常用车牌号"/>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>备用</td>
                <td>
                  <a-form-item>
                    <a-input :disabled="isView" v-decorator="['spareLicensePlateNum',{rules: [{required: false,message: '输入备用车牌号'},{max:10,message:'最多可输入10个字符'}]}]" placeholder="输入备用车牌号"/>
                  </a-form-item>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td>入职日期</td>
          <td>
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabled="isView"
                v-decorator="['entryDate',{initialValue:moment(),rules: [{required: true,message: '输入入职日期'}]}]"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </td>
          <td>是否缴纳社保</td>
          <td>
            <a-form-item>
              <a-radio-group :disabled="isView" name="haveSecurity" v-decorator="['haveSecurity',{initialValue:1,rules: [{required: true,message: '选择是否缴纳社保'}]}]" >
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>试用期</td>
          <td>
            <a-form-item>
              <a-select :disabled="isView" @change="probationTypeChange" v-decorator="['probationType',{initialValue:1,rules: [{required: true,message: '选择试用期'}]}]" placeholder="选择试用期">
                <a-select-option :value="0">无</a-select-option>
                <a-select-option :value="1">1个月</a-select-option>
                <a-select-option :value="2">2个月</a-select-option>
                <a-select-option :value="3">3个月</a-select-option>
                <a-select-option :value="4">考察期</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td>考察期限（月）</td>
          <td>
            <a-form-item>
              <a-input :disabled="isView || isProbationType4" v-decorator="['inspectMoth',{rules: [{required: !isProbationType4,message: '输入考察期限'},{max:10,message:'最多可输入10个字符'}]}]" placeholder="输入考察期限"/>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>员工状态</td>
          <td colspan="3">
            <a-form-item >
              <a-select :disabled="isView" placeholder="员工状态" v-decorator="['positionStatus',{initialValue:1,rules: [{required: true,message: '输入员工状态'}]}]">
                <a-select-option :value="1">试用期</a-select-option>
                <a-select-option :value="2" :disabled="!isEdit">试用期不通过</a-select-option>
                <a-select-option :value="3">在职</a-select-option>
                <a-select-option :value="4" :disabled="!isEdit">离职</a-select-option>
              </a-select>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>个人印章</td>
          <td >
            <a-form-item >
              <div class="clearfix">
                <a-upload
                  :disabled="isView"
                  accept="multiple"
                  name="files"
                  :action="this.uploadPath"
                  listType="picture-card"
                  :fileList="fileListSeal"
                  @preview="handlePreviewSeal"
                  @change="handleChangeSeal"
                >
                  <div v-if="fileListSeal.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">选择图片</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisibleSeal" :footer="null" @cancel="previewCancelSeal" :maskClosable="false">
                  <img alt="图片" style="width: 100%" :src="previewImageSeal" />
                </a-modal>
              </div>
              <a-input type="hidden" v-decorator="['sealUrl']"/>
            </a-form-item>
          </td>
          <td colspan="2"></td>
        </tr>
      </table>
    </a-form>
  </a-spin>
  </a-modal>
</template>

<script>
import { getUploadPath2 ,getUploadPath, getAreaByParent } from '@/api/common'
import {getDictionaryList} from '@/api/workBox'
import {
  departmentList,//所有部门
  getStationList, //获取所有岗位
} from '@/api/systemSetting'
import {comManageSettingsGetSettingsByStationId} from '@/api/communicationManagement'
import moment from 'moment'

import {
  reserveGetDetail, //获取详细信息
  reserveDoEntry, //入职操作
  getFaceNo, //获取人脸识别码
  getEntityBeforeDetail, //入职操作时，回显之前储备的用户信息
  reserveUpdateEntity,
  reserveAddOrUpdate
} from '@/api/reserveApi'

import BankChoice from './BankChoice'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name:'',
  components:{
    BankChoice:BankChoice
  },
  data(){
    return {
      visible:false,
      form: this.$form.createForm(this, { name: 'do_entry' }),
      type:'view',
      birthplaceOptions:[], //籍贯 级联 省市
      education:[],
      departmentDataSource:[], //岗位
      stationDataSource:[], //部门
      record:{},
      bankInfo:[], //银行卡信息
      isProbationType4:true,
      loading:false,
      faceCode:'', //人脸识别码
      //上传照片部分
      uploadPath: getUploadPath(), // 上传图片的url
      fileList:[],
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      photoUrls: '', // 已经上传的照片的url
      //上传照片部分END
      //个人印章
      fileListSeal:[],
      previewVisibleSeal:false,
      previewImageSeal:'',
      //个人印章END
      loading: false,
      imageUrl: '',
      spinning:false,
      stationInfoRequire:{
        email:false,
        mobile:false,
        phone:false,
        qqNum:false,
        wxNum:false,
      } //判断该岗位是否配置公司 控制显示 手机号，微信，qq，邮箱 默认不显示
    }
  },
  computed:{
    isView(){
      return this.type === 'view'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isRuzhi(){
      return this.type === 'ruzhi'
    },
    modalTitle(){
      return this.type === 'view' ? '查看' : '入职'
    }
  },
  mounted(){
    //this.init()
  },
  methods:{
    moment:moment,
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    previewCancel () {
      this.previewVisible = false
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      console.log(fileList)
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.form.setFieldsValue({
            headUrl:file.response.data[0].url
          })
        }
      }
      this.fileList = fileList // 展示照片墙
    },

    handlePreviewSeal (file) { // 点击文件链接或预览图标时的回调
      this.previewImageSeal = file.url || file.thumbUrl
      this.previewVisibleSeal = true
    },
    previewCancelSeal () {
      this.previewVisibleSeal = false
    },
    handleChangeSeal ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      console.log(fileList)
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.form.setFieldsValue({
            sealUrl:file.response.data[0].url
          })
        }
      }
      this.fileListSeal = fileList // 展示照片墙
    },
    init(){
      let that = this
      //所有省
      let task1 = function(){
        return new Promise((resolve,reject) =>{
          getAreaByParent({ pId: 100000 }).then(res => {
            that.birthplaceOptions = res.data.map(item =>{
              return {
                label:item.area,
                value:item.id,
                isLeaf:false
              }
            })
            resolve('done')
          })
        })
      }
      //学历
      let task2 = function(){
        return new Promise((resolve,reject) =>{
          getDictionaryList({parentId:1}).then(res =>{
            that.education = res.data
            resolve('done')
          })
        })
      }
      //部门
      let task3 = function(){
        return new Promise((resolve,reject) =>{
          departmentList().then(res =>{
            that.departmentDataSource = res.data.map(item =>Object.assign({},item))
            resolve('done')
          })
        })
      }
      return Promise.all([task1(),task2(),task3()])
    },
    async query(type,record){
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({},record)
      that.form.resetFields()
      if(type === 'view' || type === 'ruzhi' || type === 'edit'){
        //人员状态：默认为0浏览，1试用期，2试用期不通过，3在职，4离职
        //0为入职前，其他的都为入职后
        let isDoEntryBefore = record.status === 0 ? true : false
        let entryDetailApi =  isDoEntryBefore ? getEntityBeforeDetail : reserveGetDetail
        console.log(isDoEntryBefore ? '入职前' : '入职后')
        entryDetailApi({reserveId:record.id}).then(res =>{
          console.log(res)
          that.fillData(isDoEntryBefore ? 'before' : 'after',res.data)
        })
      }
      else{

      }
    },
    async fillData(type,resultData){

      let that = this
      await this.init()

      //before 入职前填充 after 入职后填充
      //if(type === 'before'){

        let isDoEntryBefore = that.record.status === 0 ? true : false
        // if(isDoEntryBefore){
        //   //人脸识别码
        //   getFaceNo().then(res =>{
        //     that.faceCode = res.data
        //     that.form.setFieldsValue({faceCode:that.faceCode})
        //   })
        // }

        let values = {...resultData}

        //银行卡
        that.bankInfo = values.bankCardList || []
        //that.$nextTick(() => that.$refs.bankChoice.$forceUpdate())
        //debugger
        //values.trueName = values.name //姓名
        if(values.name ){
          values.trueName = values.name
        }
        values.birthDate = values.birthDate ? moment(values.birthDate) : moment()
        values.entryDate = values.entryDate ? moment(values.entryDate) : moment()

        

        let stationId = values.stationId

        await comManageSettingsGetSettingsByStationId({id:stationId}).then(res =>{
          console.log(res)
          if(res && res.data){
            that.stationInfoRequire = {
              email:!!res.data.email,
              mobile:!!res.data.mobile,
              phone:!!res.data.phone,
              qqNum:!!res.data.qqNum,
              wxNum:!!res.data.wxNum
            }
          }
        })

        delete values.birthplace


        if(values.headUrl){
          const url = values.headUrl
          const file = url.split('/')
          const fileName = file[file.length - 1]
          that.fileList = [{
            uid: 0,
            name: fileName,
            status: 'done',
            url: values.headUrl
          }]
        }

        if(values.sealUrl){
          const url = values.sealUrl
          const file = url.split('/')
          const fileName = file[file.length - 1]
          that.fileListSeal = [{
            uid: 0,
            name: fileName,
            status: 'done',
            url: values.headUrl
          }]
        }

        if(isDoEntryBefore){ //点入职查看，需要把邮箱填充到 邮箱(私) 里面
          values.privateEmail = values.email || ''
          values.privateMobile = values.phone || ''
          delete values.email
          delete values.phone
        }

        //填充其他
        that.$nextTick(() => {
          that.form.setFieldsValue(Object.assign({},values))
          // try{
          //   let s = this.getBirthDay(values.identityCard)
          //   if(s){
          //     this.form.setFieldsValue({'birthDate':this.moment(s)})
          //   }
          // }catch(err){
          //   console.log(err)
          // }
        })
        //填充岗位
        if(values.departmentId){
          that.departmentChange(values.departmentId).then(() =>{
            that.form.setFieldsValue({stationId:stationId})
          })
        }

        //that.$nextTick(() => that.bankInfo = values.bankCardList || [] )
        //填充籍贯
        let areaIds = values.areaIds
        if(areaIds){
          let arrAreaIds = areaIds.split(',')
          let targetOption = that.birthplaceOptions.find(p =>p.value == arrAreaIds[0])
          getAreaByParent({ pId: arrAreaIds[0] }).then(res => { //城市
            targetOption.loading = false
            targetOption.children = res.data.map(item =>{
              return {label:item.area,value:item.id,isLeaf:true}
            })
            that.birthplaceOptions = [...that.birthplaceOptions]
            that.$nextTick(() =>that.form.setFieldsValue({birthplace:arrAreaIds.map(n =>parseInt(n,10))}))
          })
        }
    },
    async handleOk(){
      let that = this
      if(that.isView){
        that.visible = false
        return
      }

      let _bankChoiceResult = await that.$refs.bankChoice.validateFields()
      console.log('_bankChoiceResult',_bankChoiceResult)

      that.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)

          if(_bankChoiceResult.err){
            return
          }

          values.bankCardList = _bankChoiceResult.values.bank || []
          //values.nativePlace = '江苏徐州'
          if(values.entryDate){
            values.entryDate = values.entryDate.format('YYYY-MM-DD')
          }

          if(values.birthDate){
            values.birthDate = values.birthDate.format('YYYY-MM-DD')
            values.birthDate = values.birthDate.slice(0,10)
          }

          if(that.faceCode){
            values.faceCode = that.faceCode
          }
          if(values.birthplace && values.birthplace.length && values.birthplace.length === 2){
            let _birthplace = values.birthplace[values.birthplace.length - 1]
            values.nativePlace = _birthplace
            values.birthplace = _birthplace
          }else{
            values.nativePlace = ''
          }

          values.reserveId = that.record.id
          console.log(values)
          let isDoEntryBefore = that.record.status === 0 ? true : false
          if(that.type === 'edit'){
            let __api__ = isDoEntryBefore ? reserveAddOrUpdate : reserveUpdateEntity
            that.spinning = true
            __api__(values).then(res => {
              that.spinning = false
              if(res.code === 200){
                that.form.resetFields() // 清空表
                that.fileList = []
                that.previewImage = ''
                that.photoUrls = ''
                that.fileListSeal = []
                that.previewCancelSeal = ''
                that.visible = false

                that.$message.success('操作成功')
                that.$emit('finish')
              }else{
                that.$message.warning(res.msg)
              }
            }).catch(err =>that.spinning = false)
          }else if(that.type === 'ruzhi'){
            if(!isDoEntryBefore){
              that.$message.info('该人员已经办理入职了')
              return
            }
            that.spinning = true
            reserveDoEntry(values).then(res => {
              that.spinning = false
              if(res.code === 200){
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              }else{
                that.$message.warning(res.msg)
              }
            }).catch(err =>that.spinning = false)
          }

        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.fileList = []
      this.fileListSeal = []
      this.previewImage = ''
      this.previewCancelSeal = ''
      this.photoUrls = ''
      this.$nextTick(() =>this.visible = false)
    },
    birthplaceCascaderChange(arrSelected){
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
    },
    birthplaceCascaderLoadData(selectedOptions){
      console.log(selectedOptions)
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true
      return getAreaByParent({ pId: targetOption.value }).then(res => { //城市
        targetOption.loading = false
        targetOption.children = res.data.map(item =>{
          return {
            label:item.area,
            value:item.id,
            isLeaf:true
          }
        })
        that.birthplaceOptions = [...that.birthplaceOptions]
      }).catch(function (err) {
        console.log(err)
      })
    },
    departmentChange(departmentID){
      return getStationList({ id: departmentID }).then(res => { //岗位
        this.stationDataSource = res.data.map(item =>Object.assign({},item))
      })
    },
    probationTypeChange(e){
      //考察期需要手动输入
      this.isProbationType4 = parseInt(e,10) === 4 ? false : true
      this.form.setFieldsValue({
        inspectMoth:''
      })
    },
    validateIdentityCard(e){
      console.log(e.target.value)
      let s = this.getBirthDay(e.target.value.trim())
      if(s){
        this.form.setFieldsValue({'birthDate':this.moment(s)})
      }
    },
    getBirthDay(cardNo,format='YYYY-MM-DD'){
      if(typeof cardNo !== 'string'){
        console.log('cardNo参数必须是字符串')
        return 
      }
      if(cardNo.length !== 15 && cardNo.length !== 18){
        console.log('cardNo参数必须是15位或18位')
        return 
      }
      let is15 = cardNo.length === 15 ? true : false
      let reg = is15 
        ? /\d{6}(\d{2})(\d{2})(\d{2})\d*/ 
        : /\d{6}(\d{4})(\d{2})(\d{2})\d*/
      let result = cardNo.match(reg)
      if(result){
        format = format.toUpperCase()
        let year = is15 ? '19'+result[1] : result[1]
        let month = result[2]
        let day = result[3]
        return format.replace('YYYY',year).replace('MM',month).replace('DD',day)
      }
      return 
    }
  }
}
</script>

<style scoped>
  .do_entry_form-wrapper >>> .ant-form-item {
    margin-bottom: 0;
  }
  .custom-table-border th, .custom-table-border td{
    padding: 5px 10px;
  }
  .do_entry_form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info:before{
    left:0;
  }
</style>
