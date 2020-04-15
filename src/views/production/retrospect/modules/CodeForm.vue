<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    okText="保存"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="代码名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input @blur="checkName()" v-decorator="['codeName',{rules: [{required: true, min: 1, message: '代码名称不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['productName',{rules: [{required: true, min: 1, message: '产品名称不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status',{initialValue: 1}]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="父代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select showSearch placeholder="请选择父代码" optionFilterProp="children" :filterOption="selectFilter" v-decorator="['parentCode']">
            <a-select-option @click="getProcess(code.pcId)" v-for="(code,index) in allCode" :key="index" :value="code.pcId">{{ code.codeName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择工序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select mode="multiple" :allowClear="true" :maxTagCount="1" @change="addProcess" showSearch placeholder="请选择工序" optionFilterProp="children" :filterOption="selectFilter" v-decorator="['pocessSelect']">
            <a-select-option  v-for="(process,index) in allProcess" :key="index" :value="process.ppId">{{ process.processName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所选工序(上下拖拽调整顺序)" >
          <div class="process_header_wrapper">
            <div class="draggable-columns draggable-columns-1">序号</div>
            <div class="draggable-columns draggable-columns-2">工序名</div>
            <div class="draggable-columns draggable-columns-3">
              <a href="javascript:void(0);" @click="processClearAction" >清空</a>
            </div>
          </div>
          <vuedraggable class="process_main_wrapper" v-if="haveProcess.length > 0" ghost-class="ghost" v-model="haveProcess" @end="dragEndHandler">
            <transition-group name="list">
              <div v-for="(item,index) in haveProcess" :key="item.ppId"  class="draggable-columns-item">
                <div class="draggable-columns draggable-columns-1 " title="上下拖拽调整顺序">{{item.serialNum}}</div>
                <div class="draggable-columns draggable-columns-2 " title="上下拖拽调整顺序">{{item.processName}}</div>
                <div class="draggable-columns draggable-columns-3 " title="删除">
                  <a-popconfirm title="确认删除这条数据？" @confirm="confirm(item.cpId,index)" okText="是" cancelText="否">
                    <a-icon type="close-circle" />
                  </a-popconfirm>
                </div>
              </div>
            </transition-group>
          </vuedraggable>

          <!-- <a-table
            ref="table"
            :columns="columns"
            :dataSource="haveProcess"
            :pagination="false"
            rowKey="ppId"
          >
            <span slot="serialNum" slot-scope="text,record,index">
              <a-input :defaultValue="text" @change="e => setSerialNum(e.target.value, index)" v-decorator="['serialNum',{rules: [{required: true, min: 1, message: '序号不可为空！'}]}]" />
            </span>
            <span slot="action" slot-scope="text,record,index">
              <template>
                <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.cpId,index)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </a-table> -->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  checkCodeName,
  addOrUpdateCode,
  getProcessByCode,
  getAllCodeAndProcess,
  deleteCodeProcess ,
  importProductProcess
} from '@/api/production/retrospect'

import vuedraggable from 'vuedraggable'
export default {
  name: 'CodeForm',
  components:{
    vuedraggable
  },
  data () {
    return {
      title: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      columns: [
        {
          title: '工序名',
          dataIndex: 'processName'
        },
        {
          title: '序号',
          width: '70px',
          dataIndex: 'serialNum',
          scopedSlots: { customRender: 'serialNum' }
        },
        {
          title: '操作',
          width: '60px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      allCode: [],
      allProcess: [],
      pcId: 0,
      haveProcess: [] // 所有的工序
    }
  },
  updated() {
    //console.log(this.haveProcess.map(p =>p.serialNum))
    // let _haveProcess = this.haveProcess.map(p =>Object.assign({},p))
    // this.haveProcess = _haveProcess.map((p,index) =>{
    //   p.serialNum = index + 1
    //   return p
    // })

  },
  methods: {
    getAllProcess() {
      return getAllCodeAndProcess().then(res => {
        if (res.code === 200) {
          this.allCode = res.data.allCode
          this.allProcess = res.data.allProcess
        } else {
          console.log(res.msg)
        }
      })
    },
    add () { // 父页面点击新增调用
      this.title = '新增产品代码'
      this.visible = true
      this.pcId = 0
      this.getAllProcess()
    },
    edit (record) { // 父页面点击修改调用
      console.log(record)
      this.title = '修改产品代码'
      this.visible = true
      this.pcId = record.pcId
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue({
          codeName: record.codeName,
          productName: record.productName,
          status: record.status,
          //parentCode: record.parentCode || ''
        })
      })
      getProcessByCode({ pcId: record.pcId }).then(res => {
        if (res.code === 200) {
          this.haveProcess = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.getAllProcess().then((res) =>{
        console.log(res)
        if(parseInt(record.parentCode) > 0){
          setFieldsValue({
            parentCode: record.parentCode || 0
          })
        }
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      let that = this

      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (this.haveProcess.length === 0) {
          that.$message.warn('请选择工序！')
          //this.form.setFields({ 'pocessSelect': { value: '', errors: [{ 'message': '请选择工序！', 'field': 'pocessSelect' }] } })
          return
        }
        if (!errors) {
          this.$set(values, 'pcId', this.pcId)
          var param = { productCode: values, processList: this.haveProcess }

          console.log(param)
          console.log(JSON.stringify(param))
          //return
          that.confirmLoading = true
          addOrUpdateCode(param).then(res => {
            that.confirmLoading = false
            if (res.code === 200) {
              that.handleCancel()
            } else {
              that.$emit('ok')// 刷新父组件
              that.$message.error(res.msg)
            }
          }).catch(err =>that.confirmLoading = false)
        }

      })
    },
    handleCancel () {
      this.haveProcess = []
      this.form.resetFields() // 清空表
      this.visible = false
      this.$emit('ok')// 刷新父组件
    },
    checkName () {
      var param = {}
      if (this.form.getFieldValue('codeName') === undefined || this.form.getFieldValue('codeName').length < 1) {
        return
      } else {
        param = { codeName: this.form.getFieldValue('codeName'), pcId: this.pcId }
      }
      checkCodeName(param).then(res => {
        if (res.code !== 200) {
          this.form.setFields({ 'codeName': { value: '', errors: [{ 'message': res.msg, 'field': 'codeName' }] } })
        }
      })
    },
    getProcess (pcId) {
      getProcessByCode({ pcId: pcId }).then(res => {
        if (res.code === 200) {
          this.haveProcess = res.data.map(p =>Object.assign({},p))
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    setSerialNum (num, index) {
      this.$set(this.haveProcess[index], 'serialNum', num)
    },
    addProcess (selectedArray) {
      console.log(arguments)
      //return

      //this.haveProcess.filter(p =>selectedArray.includes(p.ppId))
      let that = this
      if(!Array.isArray(selectedArray)) return
      selectedArray.map(_ppid =>{
        if(!_ppid) return
        let target = that.haveProcess.find(p => p.ppId === _ppid)
        if(!target){
          let _p = that.allProcess.find(_p =>_p.ppId === _ppid)
          _p.serialNum = that.haveProcess.length + 1
          _p && that.haveProcess.push(_p)
        }
      })

      // var flag = true
      // for (var i = 0; i < this.haveProcess.length; i++) {
      //   var ppId = this.haveProcess[i].ppId
      //   if (ppId === process.ppId) { // 不可添加重复的工序
      //     flag = false
      //   }
      // }
      // if (flag) {
      //   this.form.setFields({ 'pocessSelect': { } })
      //   this.haveProcess.push(process)
      // }
    },
    confirm (cpId, index) { // 确认删除事件
      /*if (cpId !== undefined && cpId !== 0) {
        deleteCodeProcess({ cpId: cpId }).then(res => {
          if (res.code === 200) {
            this.haveProcess.splice(index, 1)
            this.$nextTick(() =>this.reSortAction())
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.haveProcess.splice(index, 1)
        this.$nextTick(() =>this.reSortAction())
      }
*/
      this.haveProcess.splice(index, 1)
      this.$nextTick(() =>this.reSortAction())
    },
    selectFilter (input, option) { // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    dragEndHandler(e){
      if(e && e.type === 'end'){
        this.$nextTick(() =>this.reSortAction())
      }
    },
    reSortAction(){
      let _haveProcess = this.haveProcess.map(p =>Object.assign({},p))
      this.haveProcess = _haveProcess.map((p,index) =>{
        p.serialNum = index + 1
        return p
      })
    },
    processClearAction(){
      this.haveProcess = []
    }
  }
}
</script>

<style scoped>
.process_tips{
  background-color: antiquewhite;
}
.process_header_wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2{
  flex: 1;
}
.process_main_wrapper{
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item{
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child{
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2{
  flex: 1;
}
.draggable-columns{
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,.draggable-columns-3{
  width: 50px;
}
.draggable-columns-3{
  cursor: pointer;
}
.ghost{
  background-color:rgba(	250,235,215, .5);
}

/*过渡动画*/
.list-enter-active, .list-leave-active {transition: all .5s;}
.list-enter, .list-leave-to {opacity: 0;transform: translateX(-5%);}
.list-move {transition: transform .3s;}
</style>
