<template>
  <a-form :form="form">
    <!--span:在屏幕中的占比，offset：距离左边距离，lg大屏，md中屏，sm小屏-->
    <a-row class="form-row" :gutter="24">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input @blur="checkName()" placeholder="请输入客户名称" v-decorator="['name',{rules: [{required: true, min: 2, message: '名称最少为2个字符！'}]}]"/>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入别名" read-only="read-only" @click="showAlias" v-decorator="['alias',{rules: [{required: false, min: 2, message: '别名最少为2个字符！'}]}]"/>
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
          <a-select placeholder="请选择最初获知渠道" @change="learnChange" v-decorator="['learn',{rules: [{required: true, message: '请选择最初获知渠道！'}]}]">
            <a-select-option v-for="learn in this.learns" :key="learn.index" :value="learn.id">{{ learn.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24" v-if="isOtherLearn">
        <a-form-item label="其他获知渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['otherLearn',{rules: [{required: true, message: '请输入其他获知渠道'}]}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
    <a-col :lg="12" :md="12" :sm="24">
      <a-form-item label="客户意向" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择客户意向度" v-decorator="['intention',{rules: [{required: true, message: '请选择客户意向度！'}]}]">
            <a-select-option v-for="intention in this.intentions" :key="intention.index" :value="intention.value">{{ intention.key }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="24">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="客户类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择客户类型" v-decorator="['type',{rules: [{required: true, message: '请选择客户类型！'}]}]">
            <a-select-option @click="typeChange(cType.text)" v-for="cType in this.customerTypes" :key="cType.index" :value="cType.id">{{ cType.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24" v-show="isSecond">
        <a-form-item label="所属代理商" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select showSearch placeholder="请选所属代理商" optionFilterProp="children" :filterOption="agencyfilter" v-decorator="['superiorId',{rules: [{required: isSecond, message: '请选所属代理商！'}]}]">
            <a-select-option v-for="agency in this.allAgency" :key="agency.index" :value="agency.id">{{ agency.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24" v-show="isAgency">
        <a-form-item label="代理区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input read-only="read-only" placeholder="请选择代理区域" v-decorator="['controlArea',{rules: [{required: isAgency, min: 1, message: '请选择代理区域！'}]}]"/>
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
      <a-col v-if="cId == 0" :lg="12" :md="12" :sm="24">
        <a-form-item label="录入渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select read-only="read-only" placeholder="请选录入渠道" v-decorator="['source',{rules: [{required: true, message: '请选录入渠道！'}]}]">
            <a-select-option v-for="sc in sources" :key="sc.index" :value="sc.id">
              <span v-if="sc.text != '部门客户'" >
              {{ sc.text }}
              </span>
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <a-col v-if="cId == 0" :lg="12" :md="12" :sm="24">
        <a-form-item label="客户维护周期(天)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            style="width:100%;"
            :min="5"
            :max="90"
            :step="1"
            v-decorator="['contactCycle', {initialValue:90,rules: [{ required: true, message: '客户维护周期' }]}]"
            @change="contactCycleChange"
          />
        </a-form-item>
      </a-col>

      <a-col v-if="cId == 0" :lg="12" :md="12" :sm="24">
        <a-form-item label="选择客户池" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select read-only="read-only" placeholder="请选择客户池" v-decorator="['pool',{rules: [{required: true}],initialValue: 3}]">
            <a-select-option v-for="pool in pools" :key="pool.index" :value="pool.value">{{ pool.key }}</a-select-option>
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
      <a-col :lg="24" :md="24" :sm="24">
        <a-form-item label="详细地址" :labelCol="oneLBCol" :wrapperCol="oneWPCol">
          <a-input placeholder="请填写详细地址" v-decorator="['address',{rules: [{required: true, min: 5, message: '详细地址最少为5个字符！'}]}]"/>
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
          <a-textarea placeholder="请填写业务描述" v-decorator="['businessDescription',{rules: [{required: true, min: 5, message: '业务描述最少为5个字符！'}]}]"/>
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
    <AliasName
      ref="aliasName"
      :aliasName="aliasName"
      @change="aliasChangeHandler"
    />
  </a-form>
</template>

<script>
import { checkName, allAgency } from '@/api/customer'
import { getUploadPath, getDictionary, getAreaByParent } from '@/api/common'
import AliasName from '@/components/CustomerList/AliasName'
export default {
  name: 'CommonCustomerForm',
  components:{AliasName},
  props: {
    customer: { required: true, type: Object }
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
      sources: [], // 所有录入渠道
      customerTypes: [], // 所有客户类型
      learns: [], // 客户所有的获知渠道
      intentions: [{ key: '有效客户', value: 1 }, { key: '无效客户', value: 2 }, { key: '竞争对手', value: 3 }, { key: '黑名单客户', value: 4 }],
      pools: [{ key: '待分配', value: 3 }, { key: '公共', value: 1 }], // 客户池
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      areas: [], // 区下拉框数据
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 图片文件集合
      cId: 0, // 当前修改客户id，新增为0
      uploadPath: getUploadPath(), // 上传图片的url
      isOtherLearn:false, //其他获知渠道
      aliasName:''
    }
  },
  mounted (record) { // 初始化
    this.init()
  },
  methods: {
    async init(){
      const that = this
      that.sources = await getDictionary({ text: '客户录入渠道' }).then(res => {
        return res.data.filter(item => item.text !== '自开发客户')
      })
      that.productTypes = await getDictionary({ text: '产品类型' }).then(res => res.data)
      that.customerTypes = await getDictionary({ text: '客户类型' }).then(res => res.data)
      that.learns = await getDictionary({ text: '客户获知渠道' }).then(res => res.data)
      that.provinces = await getAreaByParent({ pId: 100000 }).then(res => res.data)

      // 新增的时候不需要改变页面数据，且不能修改cId，否则页面有些关于cId去判断是新增还是修改会出错
      if (that.customer.id !== undefined && that.customer.id !== '') {
        that.cId = that.customer.id
        const { form: { setFieldsValue } } = that
        that.$nextTick(() => {
          // setFieldsValue只有通过这种方式给表单赋值
          setFieldsValue({
            name: that.customer.name,
            alias: that.customer.alias,
            tel: that.customer.tel,
            fax: that.customer.fax,
            learn: that.customer.learn,
            type: that.customer.type,
            source: that.customer.source,
            intention: that.customer.intention,
            userId: that.customer.userId,
            province: that.customer.province,
            city: that.customer.city,
            area: that.customer.area,
            address: that.customer.address,
            businessDescription: that.customer.businessDescription,
            licenseImg: that.customer.licenseImg
          })
        })
        if (that.customer.province != null && that.customer.province > 0) { // 渲染市
          that.getCity(1, that.customer.province)
        }
        if (that.customer.city != null && that.customer.city > 0) { // 渲染区
          that.getCity(2, that.customer.city)
        }
        if (that.customer.interestProduct != null && that.customer.interestProduct.length > 0) { // 感兴趣产品
          var iProduct = that.customer.interestProduct.split(',')
          setFieldsValue({ products: iProduct })
        }
        if (that.customer.superiorId != null && that.customer.superiorId > 0) { // 渲染所属代理商
          that.isSecond = true
          allAgency().then(res => {
            that.allAgency = res.data
          })
          setFieldsValue({ superiorId: that.customer.superiorId })
        }
        if (that.customer.controlArea != null && that.customer.controlArea.length > 0) { // 代理区域
          that.isAgency = true
          setFieldsValue({ controlArea: that.customer.controlArea })
        }
        if (that.customer.licenseImg != null && that.customer.licenseImg.length > 0) {
          that.fileList[0] = {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            'url': that.customer.licenseImg
          } // 图片预览缩略图
        }
      }

    },
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
    agencyfilter (input, option) { // 代理商下拉框搜索
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
        this.form.setFieldsValue({ superiorId: null })
        this.form.setFieldsValue({ 'controlArea': '' })
      }
    },
    async edit (record) { // 父页面点击修改调用
      const that = this
      await that.init()
      this.visible = true
      this.cId = record.id
      const { form: { setFieldsValue } } = this

      that.learnChange(record.learn)

      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        that.aliasName = record.alias
        setFieldsValue({
          name: record.name,
          alias: record.alias,
          tel: record.tel,
          fax: record.fax,
          learn: record.learn,
          otherLearn:record.otherLearn,
          intention: record.intention,
          type: record.type,
          source: record.source,
          pool: record.pool,
          province: record.province,
          city: record.city,
          area: record.area,
          address: record.address,
          businessDescription: record.businessDescription,
          licenseImg: record.licenseImg,
          contactCycle:record.contactCycle
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
        setFieldsValue({ superiorId: record.superiorId })
      }
      if (record.controlArea != null && record.controlArea.length > 0) { // 代理区域
        this.isAgency = true
        setFieldsValue({ controlArea: record.controlArea })
      }
      if (record.licenseImg != null && record.licenseImg.length > 0) { // 图片预览缩略图
        this.fileList[0] = {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          'url': record.licenseImg
        }
      }
    },
    nextStep () {
      var products = this.form.getFieldValue('products') // 感兴趣产品集合
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
    contactCycleChange(val){
      if(+val > 90){
        this.$message.info(`客户维护周期 最大为【${90}】天`)
        return
      }else if(+val <= 5){
        this.$message.info(`客户维护周期 最小为【5】天`)
        return
      }
    },
    learnChange(id){
      let target = this.learns.find(item => +item.id === +id)
      this.isOtherLearn = target && target.text === '其它'
    },
    showAlias() {
      this.$refs.aliasName.show();
    },
    aliasChangeHandler(str) {
      this.aliasName = str;
      this.form.setFieldsValue({alias:str})
    },
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
