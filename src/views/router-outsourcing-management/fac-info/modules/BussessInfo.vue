<template>
  <div class="__fac_info_wrapper__">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <h2>业务员信息</h2>
      <div v-for="(item, index) in form.salemanList" :key="item.key" class="__bussess_wrapper">
        <h3>业务员{{index + 1}}</h3>
        <span class="__item_action_del" @click="handleAction('del', 'salemanList', item)"
          ><a-icon type="close-circle"
        /></span>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="form.salemanList[index].name" />
        </a-form-model-item>
        <a-form-model-item label="职务" prop="position">
          <a-input v-model="form.salemanList[index].position" />
        </a-form-model-item>
        <a-form-model-item label="身份证信息" prop="cardNo">
          <a-input v-model="form.salemanList[index].cardNo" />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="tel">
          <a-input v-model="form.salemanList[index].tel" />
        </a-form-model-item>
        <a-form-model-item label="微信号" prop="wxNo">
          <a-input v-model="form.salemanList[index].wxNo" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.salemanList[index].email" />
        </a-form-model-item>
      </div>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', 'salemanList', null)"
        >添加</a-button
      >

      <h2>售后信息</h2>
      <div v-for="(item, index) in form.csupportVoList" :key="item.key" class="__bussess_wrapper">
        <h3>售后人员{{index + 1}}</h3>
        <span class="__item_action_del" @click="handleAction('del', 'csupportVoList', item)"
          ><a-icon type="close-circle"
        /></span>
        <a-form-model-item label="售后姓名" prop="name">
          <a-input v-model="form.csupportVoList[index].name" />
        </a-form-model-item>
        <a-form-model-item label="售后职务" prop="position">
          <a-input v-model="form.csupportVoList[index].position" />
        </a-form-model-item>
        <a-form-model-item label="售后手机号" prop="tel">
          <a-input v-model="form.csupportVoList[index].tel" />
        </a-form-model-item>
        <a-form-model-item label="售后微信号" prop="wxNo">
          <a-input v-model="form.csupportVoList[index].wxNo" />
        </a-form-model-item>
      </div>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', 'csupportVoList', null)"
        >添加</a-button
      >
    </a-form-model>

    <div class="steps-action">
      <a-button type="primary" @click="prev">
        上一步
      </a-button>
      <a-button type="primary" @click="next">
        下一步
      </a-button>
    </div>
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
      debugger
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
    prev(){
      let current = 1,type = 'prev'
      that.$emit('change',current,type,this.form)
    },
    next(){
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          let current = 1,type = 'next'
          that.$emit('change',current,type,this.form)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
.steps-action >>> .ant-btn{
  margin:0 5px;
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
}
</style>
