<template>
  <a-form :form="form">
    <!--span:在屏幕中的占比，labelCol:标签文字样式，wrapperCol:标签内容样式，offset：距离左边距离，lg大屏，md中屏，sm小屏-->
    <a-row class="form-row" :gutter="24">
      <a-col :lg="12" :md="12" :sm="24" >
        <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入客户名称" @blur="checkName()" v-decorator="['name',{rules: [{required: true, min: 2, message: '名称最少为2个字符！'}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入别名" v-decorator="['alias',{rules: [{required: false, min: 1, message: '别名最少为2个字符！'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="固定电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入固定电话" v-decorator="['tel',{rules: [{required: false, min: 8, message: '固定电话最少为8个字符！'}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="传真" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入传真" v-decorator="['fax',{rules: [{required: false, min: 8, message: '传真最少为8个字符！'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="最初获知渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择最初获知渠道" v-decorator="['learn',{rules: [{required: true, message: '请选择最初获知渠道！'}]}]">
            <a-select-option v-for="learn in this.learns" :key="learn.index" :value="learn.id">{{ learn.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="客户意向" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择客户意向度" v-decorator="['intention',{rules: [{required: true, message: '请选择客户意向度！'}]}]">
            <a-select-option v-for="intention in this.intentions" :key="intention.index" :value="intention.value">{{ intention.key }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="24" v-if="subType === 'add'">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="录入渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="sourceChange"  read-only="read-only" placeholder="请选录入渠道" v-decorator="['source',{rules: [{required: true, message: '请选录入渠道！'}]}]">
            <a-select-option v-for="sc in sources.filter(sc => ['部门客户','自开发客户'].includes(sc.text)) " :key="sc.index" :value="sc.id">
              {{ sc.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="客户维护周期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number 
            style="width:100%;"
            :min="5"
            :max="maxContactCycle"
            :step="1"
            v-decorator="['contactCycle', {initialValue:90,rules: [{ required: true, message: '客户维护周期' }]}]" 
            @change="contactCycleChange"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="24">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="客户类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择客户类型"
            v-decorator="['type',{rules: [{required: true, message: '请选择客户类型！'}]}]">
            <a-select-option @click="typeChange(cType.text)" v-for="cType in this.customerTypes" :key="cType.index" :value="cType.id">{{ cType.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24" v-show="isSecond">
        <a-form-item label="所属代理商" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select showSearch placeholder="请选所属代理商" optionFilterProp="children" :filterOption="agencyFilter" v-decorator="['superiorId',{rules: [{required: isSecond, message: '请选所属代理商！'}]}]">
            <a-select-option v-for="agency in this.allAgency" :key="agency.index" :value="agency.id">{{ agency.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24" v-show="isAgency">
        <a-form-item label="代理区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input read-only="read-only" placeholder="请选择代理区域" v-decorator="['controlArea',{rules: [{required: isAgency, min: 2, message: '请选择代理区域！'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24" v-show="isAgency">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="代理省" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="代理省" v-decorator="['agencyProvince']">
            <a-select-option @click="getCity(1,province.id)" v-for="province in this.provinces" :key="province.index" :value="province.area">{{ province.area }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="代理市" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="代理市" v-decorator="['agencyCity']">
            <a-select-option v-for="city in this.citys" :key="city.index" :value="city.area">{{ city.area }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24" v-show="isAgency">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="添加代理区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-button style="margin-left: 2px" @click="addProvince" type="primary">添加省</a-button>
          <a-button style="margin-left: 2px" @click="addCity" type="primary">添加市</a-button>
          <a-button style="margin-left: 2px" @click="clearAgency" type="primary">重置</a-button>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col v-show="salesJurisdiction.allSalesman != null && salesJurisdiction.allSalesman.length > 0 && cId == 0" :lg="12" :md="12" :sm="24">
        <a-form-item label="指定销售" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择指定销售" v-decorator="['userId',{rules: [{required: false}]}]">
            <a-select-option v-for="salesman in salesJurisdiction.allSalesman" :key="salesman.index" :value="salesman.userId">{{ salesman.salesmanName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="24" :md="24" :sm="24">
        <a-form-item label="所属地区" :labelCol="oneLBCol" :wrapperCol="oneWPCol">
          <a-col :lg="8" :md="8" :sm="24">
            <a-select placeholder="省" v-decorator="['province',{rules: [{required: false, message: '请选择省！'}]}]">
              <a-select-option @click="getCity(1,province.id)" v-for="province in this.provinces" :key="province.index" :value="province.id">{{ province.area }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-select placeholder="市" v-decorator="['city',{rules: [{required: false, message: '请选择区！'}]}]">
              <a-select-option @click="getCity(2,city.id)" v-for="city in this.citys" :key="city.index" :value="city.id">{{ city.area }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-select placeholder="区" v-decorator="['area',{rules: [{required: false, message: '请选择区！'}]}]">
              <a-select-option v-for="area in this.areas" :key="area.index" :value="area.id">{{ area.area }}</a-select-option>
            </a-select>
          </a-col>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="24" :md="24" :sm="24" justify="left" align="left">
        <a-form-item label="详细地址" :labelCol="oneLBCol" :wrapperCol="oneWPCol">
          <a-input placeholder="请输入详细地址" v-decorator="['address',{rules: [{required: true, min: 5, message: '详细地址最少为5个字符！'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="24" :md="24" :sm="24">
        <a-form-item label="感兴趣产品" :labelCol="oneLBCol" :wrapperCol="oneWPCol">
          <a-checkbox-group v-decorator="['products',{rules: [{required: true, message: '请选择感兴趣产品！'}]}]">
            <a-checkbox :key="pType.index" v-for="pType in productTypes" :value="pType.text">{{ pType.text }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="24" :md="24" :sm="24">
        <a-form-item label="业务描述" :labelCol="oneLBCol" :wrapperCol="oneWPCol">
          <a-textarea placeholder="请输入业务描述" v-decorator="['businessDescription',{rules: [{required: true, min: 5, message: '业务描述最少为5个字符！'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="24" :md="24" :sm="24">
        <a-form-item label="营业执照" :labelCol="oneLBCol" :wrapperCol="oneWPCol">
          <div class="clearfix">
            <a-upload
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
          <a-input type="hidden" v-decorator="['licenseImg', {rules: [{required: false,message: '请上传营业执照！'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :wrapperCol="{span: 24, offset: 20}">
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { checkName, allAgency } from '@/api/customer'
import { getUploadPath, getDictionary, getAreaByParent } from '@/api/common'

export default {
  name: 'DepCustomerForm',
  props: {
    customer: { required: true, type: Object },
    salesJurisdiction: { required: true, type: Object },
    subType:{required:true,type:String,default:() => 'add'}
  },
  data () {
    return {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      },
      oneLBCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      oneWPCol: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      isSecond: false, // 是否为代理二级客户
      isAgency: false, // 是否为代理商
      allAgency: [], // 所有代理商
      productTypes: [], // 所有产品类型
      customerTypes: [], // 所有客户类型
      learns: [], // 客户所有的获知渠道
      intentions: [{ key: '有效客户', value: 1 }, { key: '无效客户', value: 2 }, { key: '竞争对手', value: 3 }, { key: '黑名单客户', value: 4 }],
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      areas: [], // 区下拉框数据
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 图片文件集合
      cId: 0, // 当前修改客户id，新增为0
      uploadPath: getUploadPath(), // 上传图片的url
      sources:[],
      maxContactCycle:90
    }
  },
  mounted (record) { // 初始化
    getDictionary({ text: '客户录入渠道' }).then(res => {
      this.sources = res.data
    }).catch(function (err) {
      console.log(err)
    })

    getDictionary({ text: '产品类型' }).then(res => {
      this.productTypes = res.data
    }).catch(function (err) {
      console.log(err)
    })
    getDictionary({ text: '客户类型' }).then(res => {
      this.customerTypes = res.data
    }).catch(function (err) {
      console.log(err)
    })
    getDictionary({ text: '客户获知渠道' }).then(res => {
      this.learns = res.data
    }).catch(function (err) {
      console.log(err)
    })
    getAreaByParent({ pId: 100000 }).then(res => { // 所有省
      this.provinces = res.data
    }).catch(function (err) {
      console.log(err)
    })
    // 新增的时候不需要改变页面数据，且不能修改cId，否则页面有些关于cId去判断是新增还是修改会出错
    if (this.customer.id !== undefined && this.customer.id !== '') {
      this.cId = this.customer.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({
          name: this.customer.name,
          alias: this.customer.alias,
          tel: this.customer.tel,
          fax: this.customer.fax,
          learn: this.customer.learn,
          type: this.customer.type,
          intention: this.customer.intention,
          userId: this.customer.userId,
          province: this.customer.province,
          city: this.customer.city,
          area: this.customer.area,
          address: this.customer.address,
          businessDescription: this.customer.businessDescription,
          licenseImg: this.customer.licenseImg
        })
      })
      if (this.customer.province != null && this.customer.province > 0) { // 渲染市
        this.getCity(1, this.customer.province)
      }
      if (this.customer.city != null && this.customer.city > 0) { // 渲染区
        this.getCity(2, this.customer.city)
      }
      if (this.customer.interestProduct != null && this.customer.interestProduct.length > 0) { // 感兴趣产品
        var iProduct = this.customer.interestProduct.split(',')
        setFieldsValue({ products: iProduct })
      }
      if (this.customer.superiorId != null && this.customer.superiorId > 0) { // 渲染所属代理商
        this.isSecond = true
        allAgency().then(res => {
          this.allAgency = res.data
        })
        setFieldsValue({ superiorId: this.customer.superiorId })
      }
      if (this.customer.controlArea != null && this.customer.controlArea.length > 0) { // 代理区域
        this.isAgency = true
        setFieldsValue({ controlArea: this.customer.controlArea })
      }
      if (this.customer.licenseImg != null && this.customer.licenseImg.length > 0) {
        this.fileList[0] = {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          'url': this.customer.licenseImg
        } // 图片预览缩略图
      }
    }
  },
  methods: {
    addProvince () {
      var agencyProvince = this.form.getFieldValue('agencyProvince')
      if (agencyProvince !== undefined) {
        this.addArea(agencyProvince)
      }
    },
    addCity () {
      var agencyCity = this.form.getFieldValue('agencyCity')
      if (agencyCity !== undefined) {
        this.addArea(agencyCity)
      }
    },
    addArea (area) { // 拼接代理区域
      var controlArea = this.form.getFieldValue('controlArea')
      if (controlArea === undefined || controlArea.length < 1) {
        controlArea = area
      } else {
        controlArea += ',' + area
      }
      this.form.setFieldsValue({ 'controlArea': controlArea })
    },
    clearAgency () { // 清除所有代理区域
      this.form.setFields({ 'controlArea': { value: '' } })
    },
    agencyFilter (input, option) { // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getCity (type, pId) {
      getAreaByParent({ pId: pId }).then(res => {
        if (type === 1) {
          this.citys = res.data
        } else if (type === 2) {
          this.areas = res.data
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    typeChange (text) {
      if (text === '代理商') {
        this.isAgency = true
        this.isSecond = false
        this.form.setFieldsValue({ superiorId: null })
      } else if (text === '代理二级客户') {
        allAgency().then(res => {
          this.allAgency = res.data
        })
        this.isSecond = true
        this.isAgency = false
        this.form.setFieldsValue({ 'controlArea': '' })
      } else {
        this.isAgency = false
        this.isSecond = false
        this.form.setFieldsValue({ 'controlArea': '' })
        this.form.setFieldsValue({ superiorId: null })
      }
    },
    edit (record) { // 父页面点击修改调用
      this.visible = true
      this.cId = record.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({
          name: record.name,
          alias: record.alias,
          tel: record.tel,
          fax: record.fax,
          learn: record.learn,
          intention: record.intention,
          type: record.type,
          userId: record.userId,
          province: record.province,
          city: record.city,
          area: record.area,
          address: record.address,
          businessDescription: record.businessDescription,
          licenseImg: record.licenseImg
        })
      })
      if (record.province != null && record.province > 0) { // 渲染市
        this.getCity(1, record.province)
      }
      if (record.city != null && record.city > 0) { // 渲染区
        this.getCity(2, record.city)
      }
      if (record.interestProduct != null && record.interestProduct.length > 0) { // 感兴趣产品
        var iProduct = record.interestProduct.split(',')
        setFieldsValue({ products: iProduct })
      }
      if (record.superiorId != null && record.superiorId > 0) { // 渲染所属代理商
        this.isSecond = true
        allAgency().then(res => {
          this.allAgency = res.data
        })
        setFieldsValue({ superiorId: parseInt(record.superiorId) })
      }
      if (record.controlArea != null && record.controlArea.length > 0) { // 代理区域
        this.isAgency = true
        setFieldsValue({ controlArea: record.controlArea })
      }
      if (record.licenseImg != null && record.licenseImg.length > 0) {
        this.fileList[0] = {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          'url': record.licenseImg
        } // 图片预览缩略图
      }
    },
    nextStep () {
      var products = this.form.getFieldValue('products')
      var interestProduct
      if (products !== undefined && products.length > 0) {
        interestProduct = products.join(',')
      }
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$set(values, 'isSecond', this.isSecond)
          this.$set(values, 'isAgency', this.isAgency)
          this.$set(values, 'id', this.cId)
          this.$set(values, 'interestProduct', interestProduct)
          this.$emit('nextStep', values)
        }
      })
    },
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.form.setFieldsValue({ licenseImg: file.response.data[0].url })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ licenseImg: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    checkName () {
      var param = {}
      if (this.form.getFieldValue('name') === undefined || this.form.getFieldValue('name').length < 1) {
        return
      }
      param = { id: this.cId, name: this.form.getFieldValue('name') }
      checkName(param).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.form.setFields({ 'name': { value: '', errors: [{ 'message': '该客户名称已经存在!', 'field': 'name' }] } })
          }
        } else {
          console.log(res.msg)
        }
      })
    },
    handleCancel () {
      this.form.resetFields() // 清空表
    },
    sourceChange(val){
      let target = this.sources.find(item => +item.id === +val)
      if(target){
        if(target.text === '自开发客户'){
          this.form.setFieldsValue({contactCycle:365})
          this.maxContactCycle = 365
        }else{
          this.form.setFieldsValue({contactCycle:90})
          this.maxContactCycle = 90
        }
      }
    },
    contactCycleChange(val){
      if(+val > this.maxContactCycle){
        this.$message.info(`客户维护周期 最大为【${this.maxContactCycle}】天`)
        return
      }else if(+val <= 5){
        this.$message.info(`客户维护周期 最小为【5】天`)
        return
      }
    }
  }
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
