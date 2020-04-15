<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
  <a-form :form="form" class="tool_post_explain_form-wrapper">
    <table class="custom-table custom-table-border">
      <tr>
        <td colspan="1">岗位编号</td>
        <td colspan="3">
          <a-form-item>
            <a-input 
              :disabled="isView"
              v-decorator="['serialNumber', { rules: [{ required: true, message: '请输入岗位编号' }] }]" 
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>部门</td>
        <td >
          <a-form-item>
            <a-select 
              :disabled="isView" 
              placeholder="选择部门"  
              @change="depChangeHandler" 
              v-decorator="['depId', { rules: [{ required: true, message: '请选择部门' }] }]"
              style="width: 200px"
            >
              <a-select-option 
                v-for="item in depSelectDataSource" 
                :key="item.id" 
                :value="item.id" 
              >
              {{item.departmentName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>岗位</td>
        <td>
          <a-form-item>
            <a-select 
              placeholder="选择岗位"  
              :disabled="isView" 
              v-decorator="['stationId', { rules: [{ required: true, message: '请选择岗位' }] }]"
              style="width: 200px"
            >
              <a-select-option 
                v-for="item in postSelectDataSource" 
                :key="item.id" 
                :value="item.id" 
              >
              {{item.stationName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>本职描述</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入本职描述" 
              :rows="3" 
              v-decorator="['description', { rules: [{ required: true, message: '请输入本职描述' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <h3 style="text-align:left;padding:5px 0;margin:0 0 0 10px;">职责与工作任务</h3>
        </td>
      </tr>

      <tr>
        <td colspan="1">职责一</td>
        <td colspan="3">
          <table class="custom-table ">
            <tr>
              <td colspan="1">职责描述</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea 
                    :disabled="isView" 
                    placeholder="输入职责描述" 
                    :rows="2" 
                    v-decorator="['firstJobDescription', { rules: [{ required: true, message: '请输入职责描述' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="1">工作任务</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea 
                    :disabled="isView" 
                    placeholder="输入工作任务" 
                    :rows="3" 
                    v-decorator="['firstJobTask', { rules: [{ required: true, message: '请输入工作任务' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
          </table>
        </td>
      </tr>


      <tr>
        <td colspan="1">职责二</td>
        <td colspan="3">
          <table class="custom-table ">
            <tr>
              <td colspan="1">职责描述</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea 
                    :disabled="isView" 
                    placeholder="输入职责描述" 
                    :rows="2" 
                    v-decorator="['secondJobDescription', { rules: [{ required: true, message: '请输入职责描述' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="1">工作任务</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea 
                    :disabled="isView" 
                    placeholder="输入工作任务" 
                    :rows="3" 
                    v-decorator="['secondJobTask', { rules: [{ required: true, message: '请输入工作任务' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td colspan="1">职责三</td>
        <td colspan="3">
          <table class="custom-table ">
            <tr>
              <td colspan="1">职责描述</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea 
                    :disabled="isView" 
                    placeholder="输入职责描述" 
                    :rows="2" 
                    v-decorator="['thirdJobDescription', { rules: [{ required: true, message: '请输入职责描述' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="1">工作任务</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea 
                    :disabled="isView" 
                    placeholder="输入工作任务" 
                    :rows="3" 
                    v-decorator="['thirdJobTask', { rules: [{ required: true, message: '请输入工作任务' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td>相关权限</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入相关权限" 
              :rows="3" 
              v-decorator="['authority', { rules: [{ required: true, message: '请输入相关权限' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>汇报关系</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入汇报关系" 
              :rows="3" 
              v-decorator="['reportRelationship', { rules: [{ required: true, message: '请输入汇报关系' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>工作协作关系</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入工作协作关系" 
              :rows="3" 
              v-decorator="['cooperativeRelationship', { rules: [{ required: true, message: '请输入工作协作关系' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>工作时间特征</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入工作时间特征" 
              :rows="3" 
              v-decorator="['timeCharacteristics', { rules: [{ required: true, message: '请输入工作时间特征' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>任职资格</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入任职资格" 
              :rows="3" 
              v-decorator="['qualification', { rules: [{ required: true, message: '请输入任职资格' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>所需技能</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入所需技能" 
              :rows="3" 
              v-decorator="['skills', { rules: [{ required: true, message: '请输入所需技能' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>个人素质要求</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isView" 
              placeholder="输入个人素质要求" 
              :rows="3" 
              v-decorator="['quality', { rules: [{ required: true, message: '请输入岗位编号' }] }]"
            />
          </a-form-item>
        </td>
      </tr>

    </table>
  </a-form>
  </a-modal>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'

import { 
  getToolPostExplainById, 
  addToolPostExplain, 
  editToolPostExplain,
  verificationSerialNumber
} from '@/api/toolPostExplain'

export default {
  name:'ToolPostExplainForm',
  data(){
    return {
      depId:0,
      postId:0,
      depSelectDataSource:[],
      postSelectDataSource:[],
      form: this.$form.createForm(this, { name: 'ToolPostExplainForm' }),
      visible:false,
      actionType:'add',
      toolPostExplainId:null
    }
  },
  computed:{
    modalTitle(){
      return this.actionType === 'add' ? '新增岗位说明' :  this.actionType === 'edit' ? '修改岗位说明' : '查看岗位说明'
    },
    isView(){
      return this.actionType === 'view'
    }
  },
  methods:{
    init(){
      let that = this
      departmentList().then(res =>{
        that.depSelectDataSource = res.data
      })
    },
    depChangeHandler(dep_id){
      let that = this
      that.postSelectDataSource = []
      that.form.resetFields(['stationId'])//重置岗位下拉框
      return getStationList({id:dep_id}).then(res =>{
        that.postSelectDataSource = res.data
      })
    },
    async handleOk(){
      let that = this
      if(this.actionType === 'view'){
        this.visible = false
        return 
      }
      
      let resutlVerification = await verificationSerialNumber({
        id:this.toolPostExplainId,
        serialNumber:this.form.getFieldValue('serialNumber')
      }).then(res =>res.data)

      if(resutlVerification === false){
        this.$message.warning('岗位说明书编号重复，请修改后再提交')
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          let isEdit = this.actionType === 'edit'
          let fn = isEdit ? editToolPostExplain : addToolPostExplain

          if(isEdit){
            values.id = this.toolPostExplainId
          }
          fn(values).then(res =>{
            if(res.code === 200){
              that.visible = false 
              that.$message.success('操作成功')

              that.$emit('finish')
            }else{
              that.$message.warning(res.msg)
            }
          })
          .catch(err => that.$message.error('操作失败'))
        }
      });
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(opt){
      let that = this
      that.actionType = opt.actionType
      that.form.resetFields()
      that.visible = true
      if(this.actionType === 'add'){
        this.toolPostExplainId = null
        that.$nextTick(() =>that.init())
      }else if(this.actionType === 'edit' || this.actionType === 'view'){
        this.toolPostExplainId = opt.toolPostExplainId
        await departmentList().then(res =>{
          that.depSelectDataSource = res.data
        })
        await getToolPostExplainById({id:opt.toolPostExplainId}).then(async res =>{
          let result = res.data
          await that.depChangeHandler(result.depId)
          that.$nextTick(() =>that.form.setFieldsValue(res.data))
        })

        
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,.custom-table-border td{
  padding: 0;
}

.tool_post_explain_form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}

.tool_post_explain_form-wrapper >>> .ant-input{
  border: none;
  resize: none;
}
.tool_post_explain_form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
.custom-table >>> .custom-table{
  margin: -1px;
}
</style>