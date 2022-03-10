<template>
  <div class="__fac_info_wrapper__">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <h2>业务员信息</h2>
      <div v-for="(item, index) in form.salemanList" :key="item.key" class="__bussess_wrapper">
        <h3>业务员{{index + 1}}</h3>
        <span class="__item_action_del" title="删除" @click="handleAction('del', 'salemanList', item)"
          ><a-icon type="close-circle"
        /></span>
        <a-form-model-item label="姓名"
          :prop="'salemanList.' + index + '.name'"
          :rules="{
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.salemanList[index].name" />
        </a-form-model-item>
        <a-form-model-item label="职务" 
          :prop="'salemanList.' + index + '.position'"
          :rules="{
            required: true,
            message: '请输入职务',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.salemanList[index].position" />
        </a-form-model-item>
        <a-form-model-item label="身份证号码"  
          :prop="'salemanList.' + index + '.cardNo'"
          :rules="[
            {
              required: true,
              message: '请输入身份证号码',
              trigger: 'blur',
            },
            {
              pattern:/^\d{15}$|^\d{17}[0-9Xx]$/,
              message: '请输入身份证号码',
              trigger: 'blur',
            }
          ]"
        >
          <a-input v-model="form.salemanList[index].cardNo" />
        </a-form-model-item>
        <a-form-model-item label="手机号" 
          :prop="'salemanList.' + index + '.tel'"
          :rules="[
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur',
            },
            {
              pattern:/^[1][3,4,5,6,7,8,9][0-9]{9}$/,
              message: '格式不正确',
              trigger: 'blur',
            }
          ]"
        >
          <a-input v-model="form.salemanList[index].tel" />
        </a-form-model-item>
        <a-form-model-item label="微信号" 
          :prop="'salemanList.' + index + '.wxNo'"
          :rules="{
            required: true,
            message: '请输入微信号',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.salemanList[index].wxNo" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" 
          :prop="'salemanList.' + index + '.email'"
          :rules="{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.salemanList[index].email" />
        </a-form-model-item>
      </div>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', 'salemanList', null)"
        >添加</a-button
      >

      <h2>售后信息</h2>
      <div v-for="(item, index) in form.csupportVoList" :key="item.key" class="__bussess_wrapper">
        <h3>售后人员{{index + 1}}</h3>
        <span class="__item_action_del" title="删除" @click="handleAction('del', 'csupportVoList', item)"
          ><a-icon type="close-circle"
        /></span>
        <a-form-model-item label="售后姓名" prop="name"
          :prop="'csupportVoList.' + index + '.name'"
          :rules="{
            required: true,
            message: '请输入售后姓名',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.csupportVoList[index].name" />
        </a-form-model-item>
        <a-form-model-item label="售后职务" 
          :prop="'csupportVoList.' + index + '.position'"
          :rules="{
            required: true,
            message: '请输入售后职务',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.csupportVoList[index].position" />
        </a-form-model-item>
        <a-form-model-item label="售后手机号" 
          :prop="'csupportVoList.' + index + '.tel'"
          :rules="[
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur',
            },
            {
              pattern:/^[1][3,4,5,6,7,8,9][0-9]{9}$/,
              message: '请输入身份证号码',
              trigger: 'blur',
            }
          ]"
        >
          <a-input v-model="form.csupportVoList[index].tel" />
        </a-form-model-item>
        <a-form-model-item label="售后微信号" 
          :prop="'csupportVoList.' + index + '.wxNo'"
          :rules="{
            required: true,
            message: '请输入售后微信号',
            trigger: 'blur',
          }"
        >
          <a-input v-model="form.csupportVoList[index].wxNo" />
        </a-form-model-item>
      </div>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', 'csupportVoList', null)"
        >添加</a-button
      >
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'bussessInfo',
  components: {},
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      form: {
        csupportVoList: [],
        salemanList: []
      },
      rules: {}
    }
  },
  methods: {
    handleAction(type, obj, item) {
      const that = this
      if (type === 'add') {
        let list = [...that.form[obj]]
        let target = {
          key: that.$uuid(),
          name: '',
          tel: '',
          wxNo: '',
          email: ''
        }
        if (obj === 'salemanList') {
          target = {
            ...target,
            position: '',
            cardNo: ''
          }
        }
        list.push(target)
        that.form = {
          ...that.form,
          [obj]: list
        }
      } else if (type === 'del') {
        that.form = {
          ...that.form,
          [obj]: that.form[obj].filter(_item => _item.key !== item.key)
        }
      }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        const {csupportVoList,salemanList} = that.form
        if(csupportVoList.length === 0){
          that.$message.warning('请添加至少一条售后信息')
          resolve({code:500,result:{} })
          return
        }
        if(salemanList.length === 0){
          that.$message.warning('请添加至少一条业务员信息')
          resolve({code:500,result:{} })
          return
        }
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code:0,
              result:{...that.form}
            })
          } else {
            resolve({
              code:500,
              result:{}
            })
          }
        });
      })
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}

.__bussess_wrapper {
  position: relative;
  border: 2px dashed #1890ff;
  padding: 5px;
  margin-bottom: 20px;
}
.__bussess_wrapper .__item_action_del {
  position: absolute;
  top: -18px;
  right: -12px;
  z-index: 10001;
  font-size: 24px;
  color: #1890ff;
  background-color: #fff;
  cursor: pointer;
}
</style>
