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
                  placeholder="物流名称"
                  v-decorator="['title', { rules: [{ required: true, message: '请输入物流名称' }] }]"
                  allowClear
                  style="width：300px"
                />
              </a-form-item>
            </td>
            <td>负责人</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="负责人名称"
                  v-decorator="['title', { rules: [{ required: true, message: '请输入负责人名称' }] }]"
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
                  placeholder="负责人电话"
                  v-decorator="['title', { rules: [{ required: true, message: '请输入负责人电话' }] }]"
                  allowClear
                  style="width：300px"
                />
              </a-form-item>
            </td>
            <td>微信号</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="微信号"
                  v-decorator="['title', { rules: [{ required: true, message: '请输入微信号' }] }]"
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
                        placeholder="省"
                        v-decorator="['province',{rules: [{required: false, message: '请选择省！'}]}]"
                      >
                        <a-select-option
                          @click="getCity(1,province.id)"
                          v-for="province in this.provinces"
                          :key="province.index"
                          :value="province.id"
                        >{{ province.area }}</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-select
                        placeholder="市"
                        v-decorator="['city',{rules: [{required: false, message: '请选择区！'}]}]"
                      >
                        <a-select-option
                          @click="getCity(2,city.id)"
                          v-for="city in this.citys"
                          :key="city.index"
                          :value="city.id"
                        >{{ city.area }}</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :lg="5" :md="5" :sm="24">
                      <a-select
                        placeholder="区"
                        v-decorator="['area',{rules: [{required: false, message: '请选择区！'}]}]"
                      >
                        <a-select-option
                          v-for="area in this.areas"
                          :key="area.index"
                          :value="area.id"
                        >{{ area.area }}</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :lg="9" :md="9" :sm="24">
                      <a-input
                        placeholder="请输入详细地址"
                        v-decorator="['address',{rules: [{required: true, min: 5, message: '详细地址最少为5个字符！'}]}]"
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
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
            </td>
          </tr>
          <tr>
            <th colspan="3">合同</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item ,index) in todayList" :key="index">
            <td colspan="3">
              <template>
                <Mdeol ref="mdeol" @getmsg="getChildMsg" :name="todayName" />
              </template>
            </td>
            <td v-if="!isSee">
              <template>
                <a href="javascript:void(0);" @click="delItem('todayList',index)">查看</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a href="javascript:void(0);" @click="delItem('todayList',index)">删除</a>
              </template>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <a-button
                :disabled="isDisabled"
                style="width:100%;"
                type="dashed"
                icon="plus"
                @click="addItem('todayList')"
              >添加</a-button>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <b>承接单位法律承诺书</b>
            </td>
          </tr>
          <tr>
            <th colspan="3">承接单位法律承诺书</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item ,index) in planList" :key="'plan'+index">
            <td colspan="3">
              <template>
                <Mdeol ref="mdeol" @getmsg="getChildMsg" :name="planName" />
              </template>
            </td>
            <td v-if="!isSee">
              <template>
                <a href="javascript:void(0);" @click="delItem('planList',index)">查看</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a href="javascript:void(0);" @click="delItem('planList',index)">删除</a>
              </template>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <a-button
                :disabled="isDisabled"
                style="width:100%;"
                type="dashed"
                icon="plus"
                @click="addItem('planList')"
              >添加</a-button>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { getAreaByParent, getUploadPath } from '@/api/common'
import Mdeol from './upload'
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
    // vuedraggable,
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
      uploadPath: getUploadPath(), // 上传图片的url
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
      todayName: 'todayList',
      planName: 'planList',
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

    getCity(type, pId) {
      getAreaByParent({ pId: pId })
        .then((res) => {
          if (type === 1) {
            this.citys = res.data
          } else if (type === 2) {
            this.areas = res.data
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    //添加上传表格
    addItem(key) {
      this[key].push({
        contractName: undefined,
        progress: undefined,
      })
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
    //上传组件返回的数据
    getChildMsg(data) {
      console.log(data)
    },
    query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = record
      if (that.isSee || that.isEditSalary) {
        //详情接口
      } else {
        that.addItem('todayList')
        that.addItem('planList')
      }
      // if (type === 'edit-salary') {
      //   this.fillData()
      // }
    },

    // fillData() {
    //   queryList({ departmentId: this.record.deptId }).then((res) => {
    //     this.postSelectDataSource = res.data
    //   })
    //   this.$nextTick(() => {
    //     this.form.setFieldsValue({
    //       deptId: this.record.deptId,
    //       userId: this.record.userId,
    //       roomId: this.record.roomId,
    //       checkInTime: moment(this.record.checkInTime),
    //       remark: this.record.remark,
    //     })
    //   })
    // },

    handleOk() {
      console.log('你这是要提交')
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          delete values.deptId
          values.inspectTime = moment(values.inspectTime).format('YYYY-MM-DD')
          console.log(values)
          securityHealth_List_Add(values).then((res) => {
            that.spinning = false
            console.log(res)
            that.form.resetFields() // 清空表
            this.haveProcess = []
            that.visible = false
            that.$message.info(res.msg)
            that.$emit('finish')
          })
        }
      })
    },

    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    //清空
    processClearAction() {
      this.haveProcess = []
      this.form.setFieldsValue({
        roomIds: [],
      })
    },
    addProcess(selectedArray) {
      let that = this
      if (!Array.isArray(selectedArray)) return
      selectedArray.map((_ppid) => {
        if (!_ppid) return
        let target = that.haveProcess.find((p) => p.id === _ppid)
        if (!target) {
          let _p = that.allProcess.find((_p) => _p.id === _ppid)
          that.haveProcess.push(_p)
        }
      })
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    confirm(cpId, index) {
      // 确认删除事件
      this.haveProcess.splice(index, 1)
      console.log(this.haveProcess)
      let arr = []
      this.haveProcess.map((item) => {
        arr.push(item.id)
      })
      this.form.setFieldsValue({
        roomIds: arr,
      })
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
