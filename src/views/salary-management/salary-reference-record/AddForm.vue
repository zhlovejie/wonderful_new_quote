<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
  >

  <!-- <template slot="footer">
    <template v-if="isApproval && !isSelfApproval">
      <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
      <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
    </template>
    <template v-else>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">{{isSelfApproval ? '保存提交' : '确定'}}</a-button>
    </template>
  </template> -->


  <a-spin :spinning="spinning">
  <a-form :form="form" class="add-form-wrapper">
    <a-form-item hidden>
      <a-input v-decorator="['id']"/>
    </a-form-item>
    <a-form-item label="选择部门" v-if="!isDisabled">
      <a-select 
        placeholder="部门" 
        @change="depChange"
        v-model="departmentId"
        :allowClear="true"
      >
        <a-select-option
          v-for="item in depList"
          :key="item.id"
          :value="item.id"
        >
          {{item.departmentName}}
        </a-select-option>
      </a-select>
    </a-form-item>
    <table class="custom-table custom-table-border">
      <tr>
        <th>序号</th>
        <th>部门</th>
        <th>岗位</th>
        <th>参照工资(元)</th>
      </tr>
      <tr v-for="(item,idx) in postList" :key="item.id">
        <td>{{idx + 1}}</td>
        <td>{{departmentName}}</td>
        <td>{{item.stationName}}</td>
        <td>
          <a-form-item>
            <a-input-number
              v-if="!isDisabled"
              style="width:120px;"
              :min="0"
              :step="1"
              :precision="2" 
              v-decorator="[
                `investAmountList.${idx}.investAmount`,
                {
                  rules: [
                    {required: true,message: '请输入参照工资'}
                  ]
                }
              ]"
            />
            <span v-else>{{item.salary | moneyFormatNumber}}</span>
          </a-form-item>
        </td>
      </tr>
    </table>
  </a-form>
  </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
//查询部门主管
import {getPositionManager } from '@/api/personnelManagement' 
import { getDictionaryList } from '@/api/workBox'
import { 
  oaSalaryInfoStationStandardDetail,
  oaSalaryInfoStationStandardAddOrUpdate,
  oaSalaryInfoStationStandardIsAddByDepId
} from '@/api/salaryManagement'
import moment from 'moment' 



export default {
  name:'AddForm',
  components:{},
  data(){
    return {
      departmentId:undefined,
      depList:[],
      postList:[],
      form: this.$form.createForm(this),
      visible:false,
      actionType:'add',
      spinning:false,
    }
  },
  computed:{
    modalTitle(){
      let m = {'view':'查看','add':'新增','edit' : '修改','approval':'审批'}
      return `${m[this.actionType]}`
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){ //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
    departmentName(){
      let target = this.depList.find(item => item.id === this.departmentId)
      if(target){
        return target.departmentName || ''
      }
      return ''
    }
  },
  methods:{
    moment:moment,
    init(){
      let that = this
      return Promise.all([
        departmentList().then(res =>that.depList = res.data), //部门
      ])
    },
    async handleOk(){
      let that = this
      if(that.isView || that.isApproval){
        that.handleCancel()
        return 
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true
          //console.log(values)
          let {investAmountList} = values
          let standardList = that.postList.map((item,idx) => {
            let _item = {
              departmentId:item.departmentId,
              stationId:item.stationId,
              salary:investAmountList[idx].investAmount
            }
            if(that.isEdit){
              _item.id = that.record.id
            }
            return _item
          })

          oaSalaryInfoStationStandardAddOrUpdate({standardList}).then(res =>{
            that.spinning = false
            console.log(res)
            let {code,msg} = res
            if(+code === 500){
              that.$message.error(msg)
              return
            }
            that.$message.info(res.msg)
            that.$emit('finish')
            that.handleCancel()
          }).catch(err => that.spinning = false)
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.visible = true
      that.actionType = type 
      that.record = record || {}
      that.departmentId = undefined
      that.postList = []
      await that.form.resetFields() 
      await that.init() 
      if(type === 'add') return 
      //填充数据
      oaSalaryInfoStationStandardDetail({depId:that.record.departmentId})
        .then(res =>{
          that.$nextTick(() => {
            that.departmentId = that.record.departmentId
            that.postList = res.data
            let obj = {}
            res.data.map((item,idx) => {
              obj[`investAmountList.${idx}.investAmount`] = item.salary
            })
            that.$nextTick( () => that.form.setFieldsValue(obj))
          })
        })
        .catch(err => null)
    },
    depChange(dep_id){
      let that = this
      oaSalaryInfoStationStandardIsAddByDepId({depId:dep_id}).then(res =>{
        let {code,msg} = res
        if(+code === 500){
          that.$message.info(msg)
          that.postList = []
          return
        }
        getStationList({ id: dep_id }).then(res =>{
          that.postList = res.data.map(item => {
            item.stationId = item.id
            return item
          })
        })
      })
    },
    investAmountValidatorHandler(){
      
    }
  }
}
</script>

<style scoped>

.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.add-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
.custom-table >>> .custom-table{
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}

</style>