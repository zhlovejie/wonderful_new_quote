<template>
<a-modal
      :title="modalTitle"
      :width="1250"
      :visible="visible"
      :destroyOnClose="true"
      :footer="null"
      @cancel="handleCancel"
      :maskClosable="false"
    >
  <a-spin :spinning="spinning">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="routine-addform-wrapper-baseInnerData"
    >
      <h3>基本数据</h3>
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <td style="width:150px;">
              <span >日常报销单号</span>
            </td>
            <td>
              <a-form-model-item>
                {{form.serialNum || '系统生成'}}
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span class="icon-required">报销部门</span>
            </td>
            <td>
              <a-form-model-item >
                {{userInfo.departmentName}}
              </a-form-model-item>
            </td>
          </tr>

            <tr>
              <td style="width:150px;">
                <span class="icon-required">报销人</span>
              </td>
              <td>
                <a-form-model-item prop="customerName">
                  {{form.createdName}}
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span >报销时间</span>
              </td>
              <td>
                <a-form-model-item >
                  {{form.createdTime}}
                </a-form-model-item>
              </td>
            </tr>


            <tr >
              <td style="width:150px;">
                <span class="icon-required">报销描述</span>
              </td>
              <td colspan="3">
                <a-textarea  placeholder="报销描述" allow-clear autoSize  v-model="form.describes" />
              </td>
            </tr>


            <tr >
              <td style="width:150px;">
                <span class="icon-required">银行名称(开户行)</span>
              </td>
              <td >
                <a-form-model-item prop="exceptionTypeDicId">

                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">账号</span>
              </td>
              <td >
                <a-form-model-item prop="exceptionTypeDicId">

                </a-form-model-item>
              </td>
            </tr>
        </tbody>
      </table>

      <h3>行程记录</h3>
      <a-table
          :columns="travelColumns"
          :dataSource="form.travelRecordList"
          :pagination="false"
          bordered
          size="small"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            {{index + 1}}
          </div>
      </a-table>
      <h3>费用说明</h3>
      <a-table
        :columns="costColumns"
        :dataSource="form.costDetailList"
        :pagination="false"
        bordered
        size="small"
      >
        <div
          slot="order"
          slot-scope="text, record, index"
        >
          {{index + 1}}
        </div>
      </a-table>
      <h3>关联出差单</h3>
      <a-table
        :columns="travelCaseColumns"
        :dataSource="travelCaseList"
        :pagination="false"
        bordered
        size="small"
      >
        <div
          slot="order"
          slot-scope="text, record, index"
        >
          {{index + 1}}
        </div>
      </a-table>
    </a-form-model>
    <p v-if="isAdd || isEdit" style="text-align:center;">
      <a-button key="cancel" @click="() => handleCancel()">取消</a-button>
      <a-button style="margin:0 10px;" key="save" type='primary' :loading="spinning" @click="() => handleSubmit(1)">保存</a-button>
      <a-button key="submit" type='primary' :loading="spinning" @click="() => handleSubmit(2)">提交审批</a-button>
    </p>
  </a-spin>
</a-modal>
</template>
<script>

import ImgViewList from '@/components/CustomerList/ImgViewList'
import UploadFile from './UploadFile'
import moment from 'moment'

import {
  exceptionReportApproval,
  exceptionReportDetail,
  exceptionReportSaveAndUpdateDispose,
  exceptionReportSaveAndUpdateExceptionReport,
} from '@/api/after-sales-management-custom'

export default {
  name: 'exceptionAddForm',
  components:{
    UploadFile,
    ImgViewList
  },
  data() {

    return {
      visible:false,
      type:'add',
      record:{},
      form: {
        travelRecordList:[],
        costDetailList:[],
        travelId:''
      },
      travelCaseList:[],
      rules: {


      },
      spinning:false,
      visible:false,
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          attr: {
            icon: 'upload',
            'type':'link'
          }
        }
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource:[]
    }
  },
  created(){

  },
  computed: {
    modalTitle(){
      let m = {'add':'新增','edit':'编辑','view':'查看','approval':'审批'}
      return m[this.type]
    },
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    },
    costColumns(){
      let baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width:80
        },
        {
          title: '费用类别',
          dataIndex: 'startTime'
        },
        {
          title: '有票发票',
          children:[
            {
              title: '合计(元)',
              dataIndex: 'longDistanceVehicle',
            },
            {
              title: '发票详情',
              dataIndex: 'longDistanceCost',
            }
          ]
        },
        {
          title: '无票凭证',
          children:[
            {
              title: '合计(元)',
              dataIndex: 'sortDistanceVehicle',
            },
            {
              title: '付款凭证',
              dataIndex: 'sortDistanceCost',
            }
          ]
        }
      ]
      return baseColumns
    },
    travelColumns(){
      let baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width:80
        },
        {
          title: '出发时间',
          dataIndex: 'startTime'
        },
        {
          title: '出发地',
          dataIndex: 'departurePlace'
        },
        {
          title: '离开时间',
          dataIndex: 'departureTime'
        },
        {
          title: '目的地',
          dataIndex: 'destination'
        },
        {
          title: '长途交通费',
          children:[
            {
              title: '交通工具',
              dataIndex: 'longDistanceVehicle',
            },
            {
              title: '小计金额',
              dataIndex: 'longDistanceCost',
            }
          ]
        },
        {
          title: '市内交通费',
          children:[
            {
              title: '交通工具',
              dataIndex: 'sortDistanceVehicle',
            },
            {
              title: '小计金额',
              dataIndex: 'sortDistanceCost',
            }
          ]
        },
        {
          title: '餐饮费',
          children:[
            {
              title: '天数',
              dataIndex: 'repastDays',
            },
            {
              title: '小计金额',
              dataIndex: 'foodCost',
            }
          ]
        },
        {
          title: '住宿费',
          dataIndex: 'serialNum',
          children:[
            {
              title: '天数',
              dataIndex: 'accommodationDays',
            },
            {
              title: '小计金额',
              dataIndex: 'accommodationCost',
            }
          ]
        },
        {
          title: '合计(元)',
          dataIndex: 'totalCost'
        }
      ]
      return baseColumns
    },
    travelCaseColumns(){
      let baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width:80
        },
        {
          title: '出差人员',
          dataIndex: 'startTime'
        },
        {
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          dataIndex: 'startTime'
        },
        {
          title: '预支金额',
          dataIndex: 'startTime'
        }
      ]
      return baseColumns
    }
  },
  created() {
    const that = this
  },
  methods: {
    moment,
    query(type,record={}){
      const that = this
      that.type = type
      that.record = {...record}
      that.visible = true
      if(that.isAdd){
        that.form = {
          createdId:that.userInfo.id,
          createdName:that.userInfo.trueName,
          createdTime:that.moment().format('YYYY-MM-DD')
        }
      }else{
        let detail = {...that.detail}
        if(that.isEdit){
          if(detail.exceptionDate){
            detail.exceptionDate = moment(detail.exceptionDate)
          }
          if(detail.productionDate){
            detail.productionDate = moment(detail.productionDate)
          }
        }
        that.form = detail
        that.$nextTick(() => {
          if(detail.pictureUrl){
            let picFiles = detail.pictureUrl.split(',').map(url => {
              return {url }
            })
            that.$refs.uploadImage && that.$refs.uploadImage.setFiles(picFiles)
          }
        })
      }
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel(){
      const that = this
      that.form = {}
      that.visible = false
      that.$emit('finish')
    },
    handlerCustomerClick(){
      this.$refs.customerList && this.$refs.customerList.init()
    },

    fileChange(fileList,type){
      console.log(arguments)
      this.form = {
          ...this.form,
          pictureUrl:fileList.map(f => f.url).join(',')
        }
    },

    handleSubmit(operationType){
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          let params = {...that.form,operationType}
          params.productionDate = params.productionDate.format('YYYY-MM-DD')
          params.exceptionDate = params.exceptionDate.format('YYYY-MM-DD')
          exceptionReportSaveAndUpdateExceptionReport(params).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if(res.code === 200){
              that.$emit('finish')
              that.handleCancel()
            }
          }).catch(err => {
            that.spinning = false
            that.$message.error(err)
            that.$emit('finish')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handlerImageView(){
      let pictureUrl = this.form.pictureUrl
      let imgList = pictureUrl.split(',').map(url => decodeURIComponent(url))
      this.$refs.imgViewList.show(imgList)
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>

<style scoped>
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
