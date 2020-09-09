<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td colspan="4">
              <b>配货站信息</b>
            </td>
          </tr>
          <tr>
            <td>物流公司名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  placeholder="物流名称"
                  v-decorator="['logisticsCompanyName', { rules: [{ required: true, message: '请输入物流名称' }] }]"
                  allowClear
                  style="width：300px"
                />
              </a-form-item>
            </td>
            <td>负责人</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  placeholder="负责人名称"
                  v-decorator="['personChargeName', { rules: [{ required: true, message: '请输入负责人名称' }] }]"
                  allowClear
                  style="width：300px"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>负责人电话</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  placeholder="负责人电话"
                  v-decorator="['personChargeTelephone', { rules: [{ required: true, message: '请输入负责人电话' }] }]"
                  allowClear
                  style="width：300px"
                />
              </a-form-item>
            </td>
            <td>微信号</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  placeholder="微信号"
                  v-decorator="['wechatNumber', { rules: [{ required: true, message: '请输入微信号' }] }]"
                  allowClear
                  style="width：300px"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>公司地址</td>
            <td colspan="3">
              <a-row class="form-row" :gutter="24">
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item :labelCol="oneLBCol" :wrapperCol="oneWPCol">
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-select
                        :disabled="isSee"
                        placeholder="省"
                        v-decorator="['provinces',{rules: [{required: false, message: '请选择省！'}]}]"
                      >
                        <a-select-option
                          @click="getCity(1,province.id, province.area)"
                          v-for="province in this.provinces"
                          :key="province.index"
                          :value="province.id"
                        >{{ province.area }}</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-select
                        placeholder="市"
                        :disabled="isSee"
                        v-decorator="['citys',{rules: [{required: false, message: '请选择区！'}]}]"
                      >
                        <a-select-option
                          @click="getCity(2,city.id,city.area)"
                          v-for="city in this.citys"
                          :key="city.index"
                          :value="city.id"
                        >{{ city.area }}</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-select
                        placeholder="区"
                        :disabled="isSee"
                        v-decorator="['areas',{rules: [{required: false, message: '请选择区！'}]}]"
                      >
                        <a-select-option
                          @click="getCity(3,null,item.area)"
                          v-for="item in this.areas"
                          :key="item.index"
                          :value="item.id"
                        >{{ item.area }}</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :lg="9" :md="9" :sm="24">
                      <a-input
                        :disabled="isSee"
                        placeholder="请输入详细地址"
                        v-decorator="['detailedAddressName',{rules: [{required: true, min: 5, message: '详细地址最少为5个字符！'}]}]"
                      />
                    </a-col>
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <b>营业执照</b>
            </td>
          </tr>
          <tr>
            <td>营业执照</td>
            <td colspan="3" style="padding-top:30px">
              <a-form-item>
                <a-upload
                  :disabled="isSee"
                  :action="uploadPath"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length <5">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <b>货物合同</b>
              <Mdeol
                v-if="isSee"
                style="float: right;"
                ref="mdeol"
                @getmsg="getChildMsg"
                :statusId="2"
              />
            </td>
          </tr>
          <tr>
            <th colspan="3">合同</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item ,index) in todayList" :key="index">
            <td colspan="3">{{item.name}}</td>
            <td>
              <template>
                <a href="javascript:void(0);" @click="delSee(item.url)">查看</a>
              </template>
              <template v-if="!isSee">
                <a-divider type="vertical" />
                <a href="javascript:void(0);" @click="delItem('todayList',index)">删除</a>
              </template>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <b>承接单位法律承诺书</b>
              <Mdeol
                v-if="isSee"
                style="float: right;"
                ref="mdeol"
                @getmsg="getChildMsg"
                :statusId="3"
              />
            </td>
          </tr>
          <tr>
            <th colspan="3">承接单位法律承诺书</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item ,index) in planList" :key="'plan'+index">
            <td colspan="3">{{item.name}}</td>
            <td>
              <template>
                <a href="javascript:void(0);" @click="delSee(item.url)">查看</a>
              </template>
              <template v-if="isSee">
                <a-divider type="vertical" />
                <a href="javascript:void(0);" @click="delItem('planList',index)">删除</a>
              </template>
            </td>
          </tr>
        </table>
      </a-form>
      <XdocView ref="xdocView" />
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { getAreaByParent, getUploadPath2 } from '@/api/common'
import { DistributionAdd, DistributionInfot } from '@/api/distribution-management'
import Mdeol from './upload'
import XdocView from './XdocView'
import vueLs from 'vue-ls'
// import vuedraggable from 'vuedraggable'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'BecomingForm',
  components: {
    Mdeol,
    XdocView: XdocView,
  },
  data() {
    return {
      oneLBCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      oneWPCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      areas: [], // 区下拉框数据
      province: '', //选择省名称
      city: '', //选择市名称
      area: '', // 选择区名称
      uploadPath: getUploadPath2(), // 上传图片的url
      visible: false,
      spinning: false,
      // isDisabled: true,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'add',
      record: {},
      postSelectDataSource: [],
      haveProcess: [],
      previewVisible: false,
      previewImage: '',
      fileList: [], //营业执照
      todayList: [], //货物合同
      planList: [], //承接单位法律承诺书
    }
  },
  computed: {
    modalTitle() {
      //   if (this.isEditSalary) {
      //     return '修改配货站信息登记'
      //   }
      let txt = this.isView ? '新增' : '修改'
      return `${txt}配货站信息登记`
    },
    //查看
    isSee() {
      return this.type === 'see'
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isSee
    },
  },
  mounted() {
    getAreaByParent({ pId: 100000 })
      .then((res) => {
        // 所有省
        this.provinces = res.data
      })
      .catch(function (err) {
        console.log(err)
      })
  },
  methods: {
    moment: moment,
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },

    getCity(type, pId, name) {
      if (type != 3) {
        getAreaByParent({ pId: pId })
          .then((res) => {
            if (type === 1) {
              this.province = name
              this.citys = res.data
            } else if (type === 2) {
              this.city = name
              this.areas = res.data
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        this.area = name
      }
    },
    //删除上传表格
    delItem(key, index) {
      let that = this
      if (key === 'todayList') {
        that.todayList.splice(index, 1)
        // that.todayListType.splice(index, 1)
      } else {
        that.planList.splice(index, 1)
        // that.planListType.splice(index, 1)
      }
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    //上传组件返回的数据
    getChildMsg(data) {
      if (data.statusType === 2) {
        this.todayList.push(data)
      } else {
        this.planList.push(data)
      }
    },
    query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = record
      if (that.isSee || that.isEditSalary) {
        //详情接口
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        let that = this
        DistributionInfot({ id: that.record.id }).then((res) => {
          let arr = (res.data.data.addressNumber || '').split(',')
          let num = (res.data.data.addressName || '').split(',')
          that.getCity(1, arr[0], num[1])
          that.getCity(2, arr[1], num[2])
          that.getCity(3, null, num[3])

          that.fileList = res.data.data.businessLicenseList
            ? res.data.data.businessLicenseList.map((item) => {
                return {
                  uid: item.id,
                  id: item.id,
                  url: item.url,
                  statusType: item.statusType,
                  status: 'done',
                  name: '1',
                }
              })
            : []
          that.todayList = res.data.data.goodsContractList
          that.planList = res.data.data.letterommitmentList
          that.form.setFieldsValue({
            logisticsCompanyName: res.data.data.logisticsCompanyName,
            personChargeName: res.data.data.personChargeName,
            personChargeTelephone: res.data.data.personChargeTelephone,
            wechatNumber: res.data.data.wechatNumber,
            detailedAddressName: res.data.data.detailedAddressName,
            provinces: Number(arr[0]),
            citys: Number(arr[1]),
            areas: Number(arr[2]),
          })
        })
      })
    },

    handleOk() {
      console.log('你这是要提交')
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (this.type === 'edit-salary') {
            values.id = that.record.id
          }
          let arr = this.fileList
            ? this.fileList.map((file) => {
                if (file.response && file.response.code === 200 && file.name != '1') {
                  return {
                    url: file.response.data,
                    statusType: 1,
                    name: file.name,
                  }
                }
              })
            : []
          arr = arr.filter((item) => item)
          let arr1 = this.fileList
            ? this.fileList.map((file) => {
                if (file.name === '1') {
                  let arr = {
                    url: file.url,
                    statusType: 1,
                    name: file.fileName,
                  }
                  return arr
                }
              })
            : []
          arr1 = arr1.filter((item) => item)
          if (arr || that.todayList || that.planList) {
            values.annexList = [...arr, ...arr1, ...that.todayList, ...that.planList]
          }
          values.addressName = that.province + ',' + that.city + ',' + that.area
          values.addressNumber = values.provinces + ',' + values.citys + ',' + values.areas
          delete values.provinces
          delete values.citys
          delete values.areas
          DistributionAdd(values).then((res) => {
            that.spinning = false
            console.log(res)
            that.fileList = []
            that.todayList = []
            that.planList = []
            that.form.resetFields() // 清空表
            that.haveProcess = []
            that.visible = false
            that.$message.info(res.msg)
            that.$emit('finish')
          })
        }
      })
    },
    handleCancel() {
      this.fileList = []
      this.todayList = []
      this.planList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    //清空
    // processClearAction() {
    //   this.haveProcess = []
    //   this.form.setFieldsValue({
    //     roomIds: [],
    //   })
    // },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
.process_tips {
  background-color: antiquewhite;
}
.process_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.process_main_wrapper {
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50%;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}

/*过渡动画*/
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-5%);
}
.list-move {
  transition: transform 0.3s;
}
</style>
