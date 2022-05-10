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
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>物流公司名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  placeholder="姓名"
                  v-decorator="['userName', { rules: [{ required: true, message: '请输入姓名' }] }]"
                  style="width: 100%"
                />
              </a-form-item>
            </td>
            <td>电话</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="电话"
                  v-decorator="['phone', { rules: [{ required: true, message: '请输入电话' }] }]"
                  style="width: 100%"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>车辆类型</td>
            <td>
              <a-form-item>
                <a-select
                  v-decorator="['vehicleTypeId', { rules: [{ required: true, message: '请选择车辆类型' }] }]"
                  style="width: 100%"
                  placeholder="车辆类型"
                >
                  <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>运输费（元）</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :disabled="isSee"
                  placeholder="运输费（元）"
                  v-decorator="['price', { rules: [{ required: true, message: '请输入运输费（元）' }] }]"
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
                      <a-form-item>
                        <a-select
                          :disabled="isSee"
                          placeholder="省"
                          v-decorator="['provinceId', { rules: [{ required: true, message: '请选择省！' }] }]"
                        >
                          <a-select-option
                            @click="getCity(1, province.id, province.area)"
                            v-for="province in this.provinces"
                            :key="province.index"
                            :value="province.id"
                            >{{ province.area }}</a-select-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-form-item>
                        <a-select
                          placeholder="市"
                          :disabled="isSee"
                          v-decorator="['cityId', { rules: [{ required: true, message: '请选择市！' }] }]"
                        >
                          <a-select-option
                            @click="getCity(2, city.id, city.area)"
                            v-for="city in this.citys"
                            :key="city.index"
                            :value="city.id"
                            >{{ city.area }}</a-select-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-form-item>
                        <a-select
                          placeholder="区"
                          :disabled="isSee"
                          v-decorator="['areaId', { rules: [{ required: true, message: '请选择区！' }] }]"
                        >
                          <a-select-option
                            @click="getCity(3, null, item.area)"
                            v-for="item in this.areas"
                            :key="item.index"
                            :value="item.id"
                            >{{ item.area }}</a-select-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="9" :md="9" :sm="24">
                      <a-form-item>
                        <a-input
                          :disabled="isSee"
                          placeholder="请输入详细地址"
                          v-decorator="[
                            'addressDetail',
                            { rules: [{ required: true, min: 5, max: 30, message: '详细地址最少为5个字符！' }] },
                          ]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
        </table>
        <h3 style="margin: 20px">
          物流信息 <span> <a-button type="link" @click="onlogistics"> 新增物流单号 </a-button></span>
        </h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>物流单号</th>
            <th>承运方</th>
            <th>数量</th>
            <th>方数</th>
          </tr>
          <tr v-for="(item, index) in logisticsProductTransportMaterials" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.logisticsOrderNo }}</td>
            <td>{{ item.carrier }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.squareNum }}</td>
          </tr>
        </table>
      </a-form>
      <Logistics ref="logistics" @filet="onchength" />
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { getAreaByParent } from '@/api/common'
import { saveProductTransport, DistributionInfot } from '@/api/distribution-management'
import { getDictionaryList } from '@/api/workBox'
import Logistics from './Logistics'
export default {
  name: 'BecomingForm',
  components: {
    Logistics,
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
      assetTypeList: [],
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      areas: [], // 区下拉框数据
      province: '', //选择省名称
      city: '', //选择市名称
      area: '', // 选择区名称
      visible: false,
      spinning: false,
      // isDisabled: true,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'add',
      record: {},
      logisticsProductTransportMaterials: [],
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
      return `${txt}我方货物运输记录`
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
    onchength(data) {
      console.log(data)
      data = data.map((i) => {
        return {
          logisticsOrderNo: i.logisticsOrderNo,
          carrier: i.carrierType === 1 ? '配货站——' + i.logisticsCompanyName : '专车',
          count: i.invoiceCount,
          squareNum: i.squareNum,
          logisticsId: i.id,
        }
      })
      this.logisticsProductTransportMaterials = data
    },
    onlogistics() {
      this.$refs.logistics.init()
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
      getDictionaryList({ parentId: '543' }).then((res) => {
        this.assetTypeList = res.data
      })
      if (that.isSee || that.isEditSalary) {
        //详情接口
        // this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        let that = this
        DistributionInfot({ id: that.record.id }).then((res) => {
          let arr = (res.data.data.addressNumber || '').split(',')
          let num = (res.data.data.addressName || '').split(',')
          that.getCity(1, arr[0], num[0])
          that.getCity(2, arr[1], num[1])
          that.getCity(3, arr[2], num[2])
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
      let that = this
      if (that.type === 'see') {
        that.visible = false
        that.$emit('finish')
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.address = that.province + ',' + that.city + ',' + that.area
            // values.addressNumber = values.provinces + ',' + values.citys + ',' + values.areas
            // delete values.provinces
            // delete values.citys
            // delete values.areas
            values.logisticsProductTransportMaterials = this.logisticsProductTransportMaterials
            that.spinning = true
            saveProductTransport(values).then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
          }
        })
      }
    },
    handleCancel() {
      this.fileList = []
      this.todayList = []
      this.planList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
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
