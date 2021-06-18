<template>
  <a-modal
    :title="modalTitle"
    :width="940"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="id" hidden>
          <a-input v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input disabled v-decorator="['productName', {}]" />
        </a-form-item>
        <a-form-item label="产品代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input disabled v-decorator="['productModel', {}]" />
        </a-form-item>
        <!-- <a-form-item label="区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input disabled v-decorator="['areaName',{}]"/>
        </a-form-item> -->
        <!-- <a-form-item label="区域编号" hidden>
          <a-input v-decorator="['area', {}]" />
        </a-form-item> -->
        <a-form-item label="成本价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-Number
            v-decorator="[
              'costPrice',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入B价!',
                  },
                ],
              },
            ]"
            @change="constPriceAction($event)"
          />
        </a-form-item>
        <!-- <a-form-item label="A价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['priceA',{}]"/>
        </a-form-item>
        <a-form-item label="B价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['priceB',{ rules: [{
              pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确B价!',
            }, {
              required: true, message: '请输入B价!',
            }]}]"/>
        </a-form-item> -->
        <a-form-item label="C价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input disabled placeholder="自动计算" v-decorator="['priceC']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { editProduct, queryTreeByArea, queryPriceByArea } from '@/api/workBox'

export default {
  name: 'PriceEdit',
  data() {
    return {
      type: undefined,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: this.$form.createForm(this),
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      treeData: [],
      record: {},
      priceByArea: {},
    }
  },
  computed: {
    modalTitle() {
      let m = {
        add: '新增',
        edit: '修改',
      }
      return `${m[this.type]}产品价格`
    },
  },
  created(record) {
    // 初始化钩子,获取所有产品类型
  },
  methods: {
    async edit(type, record) {
      // 父页面点击修改调用
      this.type = type
      this.visible = true
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        this.form.setFieldsValue({
          id: record.id,
          productName: record.productName,
          productModel: record.productModel,
          costPrice: record.costPrice,
          // priceA: record.priceA,
          // priceB: record.priceB,
          priceC: record.priceC,
          // areaName:record.areaName || '该产品尚未选择区域',
          // area: record.area,
        })
      })

      this.record = record
      // await this.initProductPriceRate(record.area)
    },
    handleSubmit() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          editProduct(values)
            .then((res) => {
              if (res.code == 200) {
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok') // 刷新父组件
              } else {
                Number
                console.log('msg', '修改产品价格失败')
              }
            })
            .catch(function (err) {
              console.log(err)
            })
          this.form.resetFields() // 清空表
        }
      })
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.priceByArea = {}
      this.visible = false
    },
    previewCancel() {
      this.previewVisible = false
    },
    // initProductPriceRate(id) {
    //   let that = this
    //   // if (id === null || id === undefined) {
    //   //   that.$message.error('该产品尚未选择区域')
    //   //   return
    //   // }
    //   return queryPriceByArea(id).then((res) => {
    //     if (res.code !== 200) {
    //       that.$message.error(res.msg)
    //       return
    //     }
    //     that.priceByArea = res.data
    //   })
    // },
    //格式化接口数据 key,title,value
    // formatTreeData(item, level = 1) {
    //   let that = this
    //   let obj = {}
    //   obj.key = String(item.key)
    //   obj.title = item.title
    //   obj.value = String(item.key)
    //   obj.icon = item.icon
    //   obj.parentId = item.parentId
    //   obj.level = level
    //   if (level === 1) {
    //     obj.selectable = false
    //   }
    //   level++
    //   if (item.children !== null && Array.isArray(item.children)) {
    //     obj.children = item.children.map((v) => that.formatTreeData(v, level))
    //   }
    //   return obj
    // },
    // findAction(item, key) {
    //   let that = this
    //   if (item.key === key) {
    //     return item
    //   }
    //   if (item.children !== null && Array.isArray(item.children)) {
    //     let i = 0,
    //       len = item.children.length
    //     for (; i < len; i++) {
    //       let _item = item.children[i]
    //       let _res = that.findAction(_item, key)
    //       if (_res !== null) {
    //         return _res
    //       }
    //     }
    //   }
    //   return null
    // },
    constPriceAction(e) {
      let that = this
      let _costPrice = parseFloat(e.target.value)
      // _costPrice = isNaN(_costPrice) ? 0 : _costPrice
      // let apriceRate = this.priceByArea['1'], //a价
      //   bpriceRate = this.priceByArea['2'], //b价
      // cpriceRate = this.priceByArea['3'] //c价

      // apriceRate = isNaN(parseFloat(apriceRate)) ? 0 : parseFloat(apriceRate)
      // bpriceRate = isNaN(parseFloat(bpriceRate)) ? 0 : parseFloat(bpriceRate)
      // cpriceRate = isNaN(parseFloat(cpriceRate)) ? 0 : parseFloat(cpriceRate)

      // let __a = _costPrice * apriceRate
      // let __b = _costPrice * bpriceRate
      // let __c = _costPrice * cpriceRate
      // __a = isNaN(__a) ? 0 : Number(__a).toFixed(2)
      // __b = isNaN(__b) ? 0 : Number(__b).toFixed(2)
      // __c = isNaN(__c) ? 0 : Number(__c).toFixed(2)

      // let obj = {}
      // obj['priceA'] = __a
      // obj['priceB'] = __b
      // obj['priceC'] = __c
      // this.form.setFieldsValue(obj)
    },
  },
}
</script>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
