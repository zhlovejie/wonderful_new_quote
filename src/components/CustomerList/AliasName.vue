<template>
  <!-- 客户多别名组件 -->
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div class="alias-wrapper">
      <a-form :form="form">
        <a-form-item
          :label="`别名${idx + 1}`"
          v-for="(item, idx) in aliasList"
          :key="item.key"
        >
          <a-input
            type="text"
            style="width: 400px"
            @change="(e) => doAction('change', item.key, e.target.value)"
            v-decorator="[
              `aliasList.${idx}.value`,
              {
                initialValue: item.value,
                rules: [{ required: true, message: '请输入别名' ,whitespace: true}],
              },
            ]"
          />
          <a-button type="link" @click="doAction('del', item.key)"
            >删除</a-button
          >
        </a-form-item>
        <p>
          <a-button
            style="width: 100%"
            type="dashed"
            icon="plus"
            @click="doAction('add')"
            >添加别名</a-button
          >
        </p>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { checkName } from '@/api/customer'
let uuid = () => Math.random().toString(16).slice(-8);
export default {
  name: "alias-demo",
  props: {
    aliasName: {
      type: String,
      default: () => "",
    },
    id:{
      type:[String,Number],
      default:() => 0
    }
  },
  data() {
    return {
      visible: false,
      modalTitle: "设置别名",
      form: this.$form.createForm(this, { name: "alias-demo-form" }),
      aliasList: [],
    };
  },
  watch: {
    aliasName: {
      handler(v) {
        this.setAliasName(v);
      },
      immediate: true,
    },
  },
  methods: {
    doAction(type, key, value) {
      const that = this;
      if (type === "add") {
        that.aliasList.push({
          key: uuid(),
          value: "",
        });
      } else if (type === "del") {
        that.aliasList = that.aliasList.filter((item) => item.key !== key);
      } else if (type === "change") {
        let aliasList = [...that.aliasList];
        let target = aliasList.find((item) => item.key === key);
        target.value = value;
        that.aliasList = aliasList;
      }
    },
    setAliasName(aliasName) {
      const that = this;
      that.aliasList = [];
      if (!aliasName) {
        return;
      }
      that.$nextTick(() => {
        that.aliasList = aliasName
          .split(",")
          .map((v) => ({ key: uuid(), value: v }));
      });
    },
    getAliasName() {
      const that = this;
      let aliasName = that.aliasList.map((item) => item.value).join(",");
      console.log(`getAliasName:${aliasName}`);
    },
    handleSubmit(e) {
      e.preventDefault();
      const that = this;
      that.form.validateFields(async (err, values) => {
        if (!err) {
          let _aliasName = ''
          if(values.aliasList){
            let _aliasNameArr = values.aliasList.map(item => String(item.value).trim())
            if(that.isDuplicate(_aliasNameArr)){
              that.$message.info('存在重复别名，请处理。')
              return
            }

            let result = await Promise.all(_aliasNameArr.map(n => that.checkName(n)))
            let duplicateItems = result.filter(item => item.duplicate)
            if(duplicateItems.length > 0){
              that.$warning({
                title: '名称重复提示',
                content: (
                  <div class="__notice-wrapper">
                    <p>以下名称存在重复：</p>
                    {
                      duplicateItems.map(n => (<p>{n.msg}</p>))
                    }
                    <p>请处理。</p>
                  </div>
                ),
                width: 450,
                onOk: () => {

                },
              })
              return
            }

            _aliasName = _aliasNameArr.join(',')
          }
          that.$emit("change", _aliasName);
          that.visible = false;
        }
      });
    },
    isDuplicate(arr){
      return arr.length !== [...new Set(arr)].length
    },
    handleCancel() {
      this.visible = false;
    },
    show() {
      this.visible = true;
      this.$nextTick(() => {
        this.setAliasName(this.aliasName);
      });
    },
    checkName (name) {
      const that = this
      // if(!that.id){
      //   return {duplicate:false,msg:''}
      // }
      return checkName({ id: that.id, name}).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          return {duplicate:true,msg:`客户【${name}】名称已经存在`}
        } else {
          return {duplicate:false,msg:''}
        }
      }).catch(err => {
        console.log(err)
        return {duplicate:false,msg:''}
      })
    },
  },
};
</script>

<style scoped>
.alias-wrapper >>> .ant-form-item {
  display: flex;
}
.ant-form-item >>> .ant-form-item-label {
  width: 80px;
  text-align: left;
}
</style>
