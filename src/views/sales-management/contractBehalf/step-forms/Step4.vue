<template>
  <div class="content-wrap">
    <a-form :form="form" @submit="handleSubmit">
      <table class="custom-table custom-table-border">
        <caption>
          运输方式/交货地址
        </caption>
        <tbody>
          <tr>
            <td style="width: 300px">交货地点</td>
            <td>
              <a-row :gutter="50">
                <a-col :span="10">
                  <a-form-item>
                    <a-cascader
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['areaPlace', { rules: [{ required: false, message: '选择省市区' }] }]"
                      :options="birthplaceOptions"
                      @change="birthplaceCascaderChange"
                      :loadData="birthplaceCascaderLoadData"
                      placeholder="选择省市区"
                    />
                  </a-form-item>
                  <!-- <ContactForm ref="contactForm" :contacts="contacts" /> -->
                </a-col>
                <a-col :span="14">
                  <a-form-item>
                    <a-input
                      :disabled="this.$parent.routeParams.action === 'see'"
                      placeholder="输入详细地址"
                      v-decorator="['deliveryPlace', { rules: [{ required: true, message: '输入详细地址' }] }]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
          <tr>
            <td style="width: 300px">交货日期</td>
            <td>
              <a-row :gutter="50">
                <a-col :span="24">
                  <a-form-item>
                    <a-input
                      :disabled="this.$parent.routeParams.action === 'see'"
                      type="text"
                      v-decorator="['deliveryDate', { rules: [{ required: true, message: '请输入交货日期！' }] }]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
          <tr>
            <td style="width: 300px">运输方式及到达（港）站和费用承担</td>
            <td>
              <a-row :gutter="50">
                <a-col :span="24">
                  <a-form-item>
                    <a-radio-group
                      :disabled="this.$parent.routeParams.action === 'see'"
                      @change="transportTypeSelected"
                      v-decorator="['transportMode', { initialValue: 1 }]"
                    >
                      <a-radio :value="1">代办运输</a-radio>
                      <a-radio :value="2">自提</a-radio>
                    </a-radio-group>
                    <!-- <a-radio-group
                    @change="transportTypeSelected"
                    v-decorator="['transportMode',{initialValue: 1}]"
                    :disabled="freightType === 0"
                  >
                    <a-radio :value=1>代办运输</a-radio>
                    <a-radio :value=0>自提</a-radio>
                    </a-radio-group>-->
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>

          <tr>
            <td style="width: 300px">其他信息</td>
            <td>
              <a-row :gutter="50">
                <a-col :span="24">
                  <a-form-item>
                    <a-input
                      :disabled="this.$parent.routeParams.action === 'see'"
                      type="text"
                      v-decorator="['deliveryOther']"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
        </tbody>
      </table>
      <a-form-item class="btns-grop" style="border-left: none">
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getQueryOne, saveDeliveryAddress, deleteQueryOne } from '@/api/contractListManagement'
import ContactForm from './ContactForm'
import moment from 'moment'
import { getAreaByParent } from '@/api/common'
export default {
  name: 'Step4',
  components: {
    ContactForm,
  },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    const queryOneData = { ...this.queryonedata }
    return {
      queryOneData: queryOneData,
      // form
      form: this.$form.createForm(this),
      contractNum: this.queryonedata.contractNum, // 合同编号
      loading: false,
      timer: 0,
      id: 0,
      domEles: {},
      contacts: [],
      freightType: 0, // 是否含运费 0是，1否
      birthplaceOptions: [], //籍贯 级联 省市
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    },
  },
  mounted() {
    this.init()
  },
  directives: {
    getdom(el, binding) {
      if (typeof binding.value == 'function') binding.value(el)
    },
  },
  methods: {
    regist(flag) {
      return (el) => {
        this.domEles[flag] = el
      }
    },
    addLinkman() {
      var aaa = this.$refs.linkmanDiv.innerHTML
      console.log('aaa', aaa)
      var span1 = this.domEles.span1
      console.log('span1======', span1) //=> the span DOM Element
      console.log('span1innerHTML======', span1.innerHTML) //=> the span DOM Element
    },
    async init() {
      const that = this
      if (that.queryonedata && that.queryonedata) {
        let react = that.queryonedata
        that.form.setFieldsValue({
          freightType: react.freightType || 0,
          transportMode: react.transportMode || 1,
          deliveryDate: react.deliveryDate,
          deliveryOther: react.deliveryOther === null ? '' : react.deliveryOther,
          deliveryPlace: react.deliveryPlace,
        })
        let { deliveryPlace, detailDeliveryAreaIds } = react
        let _areaData = await that.loadAreaAction(100000)
        that.birthplaceOptions = _areaData
        if (detailDeliveryAreaIds) {
          let _arr = detailDeliveryAreaIds.split(',')
          _arr = _arr.map((v) => parseInt(v, 10))
          let _areaCityData = await that.loadAreaAction(_arr[0])
          let ctiyTargetOption = that.birthplaceOptions.find((p) => p.value == _arr[0])
          if (ctiyTargetOption) {
            ctiyTargetOption.children = _areaCityData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }

          let _areaAreaData = await that.loadAreaAction(_arr[1])
          let areaTargetOption = ctiyTargetOption.children.find((p) => p.value == _arr[1])
          if (areaTargetOption) {
            areaTargetOption.children = _areaAreaData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }
          that.$nextTick(() => that.form.setFieldsValue({ areaPlace: _arr }))
        }
      }
    },

    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      if (that.$parent.routeParams.action === 'see') {
        return that.$emit('nextStep', { ...that.queryonedata })
      }
      const {
        form: { validateFields },
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          console.log('先校验，通过表单校验后，才进入下一步', values)
          // let contact = that.$refs.contactForm.validate()
          // if (contact.err) {
          //   return
          // }
          //let contactResult = that.unMakeContact(contact.values.contact)
          //   if (!(Array.isArray(values.areaPlace) && values.areaPlace.length === 3)) {
          //  params. deliveryAreaId=values.areaPlace[values.areaPlace.length - 1],
          //   }
          // var deliveryAreaId
          // if (Array.isArray(values.areaPlace) && values.areaPlace.length === 3) {
          //   /*that.$message.info('请选择交货地点的省市区')
          //   return*/
          // }
          var deliveryAreaId
          var detailDeliveryAreaIds
          if (Array.isArray(values.areaPlace) && values.areaPlace.length === 3) {
            /*that.$message.info('请选择交货地点的省市区')
            return*/
            deliveryAreaId = values.areaPlace[values.areaPlace.length - 1]
            detailDeliveryAreaIds = values.areaPlace.toString()
          }

          const params = {
            detailDeliveryAreaIds: detailDeliveryAreaIds,
            deliveryAreaId: deliveryAreaId,
            deliveryPlace: values.deliveryPlace,
            freightType: values.freightType,
            transportMode: values.transportMode,
            deliveryOther: values.deliveryOther ? values.deliveryOther : '无',
            deliveryDate: values.deliveryDate,
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          // saveDeliveryAddress(params)
          //   .then((res) => {
          //     console.log('校验成功，保存填写的信息，请求后端接口结果', res)
          //     that.id = res.data.id
          //     that.loading = false
          //     // that.form.setFieldsValue({
          //     //   contractNum: res.data.contractNum
          //     // })
          //     if (status != 1) {
          console.log(params)
          that.$emit('nextStep', { ...params })
          //     } else {
          //       that.$message.success('保存成功')
          //     }
          //   })
          //   .catch((error) => {
          //     console.error(error)
          //   })
        }
      })
    },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },
    // 详细地址
    deliveryAddressChange(e) {
      this.deliveryAddress = e.target
    },
    // 联系人姓名
    deliveryNameChange(e) {
      this.deliveryName = e.target
    },
    // 联系人手机号
    deliveryMobileChange(e) {
      this.deliveryMobile = e.target
    },
    // 是否含运费
    freightTypeSelected(e) {
      this.freightType = e.target.value
      if (this.freightType === 0) {
        // 如果含运费择默认选择代办运输
        this.form.setFieldsValue({ transportMode: 1 })
      }
      console.log('//选择是否含运费', e.target.value)
    },
    // 自提/代办运输
    transportTypeSelected(e) {
      this.transportMode = e.target.value
      console.log('选择自提/代办运输', e.target.value)
    },
    /**
     * @description 联系人字符串转换为对象
     * @param {*} contactOpt
     * 示例：
     * {addressStr:'1;2;3',nameStr:'1',mobilStr:'1'}
     * 转换为
     * [
     *  { name: '1', telphone: '1', address: '1' },
     *  { name: '', telphone: '', address: '2' },
     *  { name: '', telphone: '', address: '3' }
     * ]
     */
    makeContact(contactOpt) {
      let _addressStr = contactOpt.addressStr || ''
      let _nameStr = contactOpt.nameStr || ''
      let _mobilStr = contactOpt.mobilStr || ''

      let addressArr = _addressStr.split(';')
      let nameArr = _nameStr.split(';')
      let mobileArr = _mobilStr.split(';')
      let maxLen = Math.max(addressArr.length, nameArr.length, mobileArr.length)
      let minLen = Math.min(maxLen, 3)
      if (addressArr.length < minLen) {
        let arr = new Array(minLen)
        addressArr.map((val, index) => (arr[index] = val))
        addressArr = arr
      }
      if (nameArr.length < minLen) {
        let arr = new Array(minLen)
        nameArr.map((val, index) => (arr[index] = val))
        nameArr = arr
      }
      if (mobileArr.length < minLen) {
        let arr = new Array(minLen)
        mobileArr.map((val, index) => (arr[index] = val))
        mobileArr = arr
      }
      let contacts = []
      addressArr.map((val, index) => {
        contacts.push({
          name: nameArr[index] ? nameArr[index] : '',
          telphone: mobileArr[index] ? mobileArr[index] : '',
          address: addressArr[index] ? addressArr[index] : '',
        })
      })
      return contacts
    },
    unMakeContact(contact) {
      if (!Array.isArray(contact)) {
        throw new Error('参数 contact 必须为数组...')
      }
      if (contact.length === 0) {
        return { addressStr: '', nameStr: '', mobilStr: '' }
      }
      let res = contact.reduce(
        (accumulator, item, index, arr) => {
          let { name, telphone, address } = item
          if (name && name.length > 0) {
            accumulator.nameStr += name + ';'
          }
          if (telphone && telphone.length > 0) {
            accumulator.mobilStr += telphone + ';'
          }
          if (address && address.length > 0) {
            accumulator.addressStr += address + ';'
          }
          if (index === arr.length - 1) {
            //处理多余的 ;
            Object.keys(accumulator).map((k) => {
              accumulator[k] = accumulator[k].endsWith(';') ? accumulator[k].slice(0, -1) : accumulator[k]
            })
          }
          return accumulator
        },
        { addressStr: '', nameStr: '', mobilStr: '' }
      )
      return res
    },
    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
    },
    birthplaceCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value })
        .then((res) => {
          //城市
          targetOption.loading = false
          targetOption.children = res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then((res) => {
          //城市
          return res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
        })
        .catch(function (err) {
          console.log(err)
          return []
        })
    },
  },
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}
.btns-grop button:not(first-child) {
  margin-left: 12px;
}
.inner-row {
  width: 80%;
}
.inner-row6 {
  width: 60%;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}
.ant-form-item-children {
  display: block;
}
.ant-form-item-control-wrapper {
  width: 100%;
}
</style>
