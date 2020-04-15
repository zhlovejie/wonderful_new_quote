<template>
  <a-modal
    :title="dialogTitle"
    :visible="visible"
    width="1000px"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-form :form="form">
      <span>基本信息</span>
      <div class="form-container">
        <a-form-item label="Id" hidden>
          <a-input v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="Id" hidden>
          <a-input v-decorator="['userInfo.id', {}]" />
        </a-form-item>
        <a-form-item label="Id" hidden>
          <a-input v-decorator="['userInfo.userId', {}]" />
        </a-form-item>
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">姓名</div>
          <div class="row-item wid-35">
            <a-input style="width: 150px" v-decorator="['trueName', {}]" :disabled="disable" />
          </div>
          <div class="row-item wid-15">性别</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-select
                style="width: 150px"
                placeholder="请选择"
                v-decorator="['sex', {rules: [{required: true, message: '请选择运性别!',}]}]"
                :disabled="disable"
              >
                <a-select-option :value="0">女</a-select-option>
                <a-select-option :value="1">男</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form-item>

        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">紧急联系人</div>
          <div class="row-item wid-35">
            <a-input
              style="width: 150px"
              v-decorator="['userInfo.emergencyContact', {}]"
              :disabled="disable"
            />
          </div>
          <div class="row-item wid-15">紧急联系人电话</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-input
                style="width: 150px"
                v-decorator="['userInfo.emergencyTelephone', {}]"
                :disabled="disable"
              />
            </a-form-item>
          </div>
        </a-form-item>

        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">手机号(私)</div>
          <div class="row-item wid-35">
            <a-input style="width: 150px" v-decorator="['mobile', {}]" :disabled="disable" />
          </div>
          <div class="row-item wid-15">QQ号(私)</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-input style="width: 150px" v-decorator="['qqNum', {}]" :disabled="disable" />
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">微信号(私)</div>
          <div class="row-item wid-35">
            <a-input style="width: 150px" v-decorator="['wxNum', {}]" :disabled="disable" />
          </div>
          <div class="row-item wid-15">邮箱号(私)</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-input style="width: 150px" v-decorator="['email', {}]" :disabled="disable" />
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">居住地址</div>
          <div class="row-item wid-85">
            <a-input v-decorator="['userInfo.address', {}]" :disabled="disable" />
          </div>
        </a-form-item>
      </div>
      <span>职工信息</span>
      <div class="form-container">
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">工号</div>
          <div class="row-item wid-35">
            <a-input style="width: 150px" v-decorator="['jobNum', {}]" :disabled="true" />
          </div>
          <div class="row-item wid-15">部门</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-select
                style="width: 150px"
                @change="handleProvinceChange"
                placeholder="请选择"
                v-decorator="['departmentId', {rules: [{required: true, message: '请选择部门!'}]}]"
                :disabled="disable"
              >
                <a-select-option
                  v-for="item in departmentList"
                  :value="item.id"
                >{{ item.departmentName }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form-item>

        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">岗位</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-select
                placeholder="请选择"
                style="width: 150px"
                v-decorator="['stationId', {rules: [{required: true, message: '请选择岗位!',}]}]"
                :disabled="disable"
              >
                <a-select-option v-for="item in stationList" :key="item.id">{{ item.stationName }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="row-item wid-15">手机号(公)</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-input
                style="width: 150px"
                v-decorator="['userInfo.mobile', {}]"
                :disabled="disable"
              />
            </a-form-item>
          </div>
        </a-form-item>

        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">QQ号(公)</div>
          <div class="row-item wid-35">
            <a-input style="width: 150px" v-decorator="['userInfo.qqNum', {}]" :disabled="disable" />
          </div>
          <div class="row-item wid-15">微信号(公)</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-input
                style="width: 150px"
                v-decorator="['userInfo.wxNum', {}]"
                :disabled="disable"
              />
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">邮箱号(公)</div>
          <div class="row-item wid-35">
            <a-input style="width: 150px" v-decorator="['userInfo.email', {}]" :disabled="disable" />
          </div>
          <div class="row-item wid-15">员工状态</div>
          <div class="row-item wid-35">
            <a-form-item style="margin: 0">
              <a-select
                style="width: 150px"
                placeholder="请选择"
                v-decorator="['positionStatus', {}]"
                :disabled="disable"
              >
                <a-select-option :value="0">试用期</a-select-option>
                <a-select-option :value="1">转正</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">银行卡</div>
          <div class="row-item wid-35">
            <a-input v-decorator="['userInfo.bankCard', {}]" :disabled="disable" />
          </div>
          <div class="row-item wid-15">车牌号</div>
          <div class="row-item wid-35">
            <a-input v-decorator="['userInfo.licensePlateNum', {}]" :disabled="disable" />
          </div>
        </a-form-item>
        <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
          <div class="row-item wid-15">个人印章</div>
          <div class="row-item wid-35">
            <img style="width: 80%;" :src="sealUrl" />
          </div>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import { getStationList, getJobNum, departmentList, userAdd, userModify } from '@/api/systemSetting'
export default {
  name: 'UserSee',
  data () {
    return {
      form: this.$form.createForm(this),
      dialogTitle: '',
      visible: false,
      selectedStationId: '',
      departmentList: [],
      stationList: [],
      jobNum: '',
      action: '',
      disable: false,
      sealUrl: ''
    }
  },
  created () {
    getJobNum().then(res => {
      this.jobNum = res.data
    })
    departmentList()
      .then(data => {
        this.departmentList = data.data
      })
      .catch(error => {
        console.error(error)
      })
  },
  methods: {
    add () {
      this.dialogTitle = '新建'
      this.disable = false
      this.action = 'add'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ jobNum: this.jobNum })
      })
    },
    see (record) {
      console.log('chak=========', record)
      this.dialogTitle = '查看'
      this.disable = true
      this.visible = true
      getStationList({ id: record.departmentId }).then(res => {
        this.stationList = res.data
      })
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
      if (record.userInfo.sealUrl !== undefined && record.userInfo.sealUrl != null && record.userInfo.sealUrl.length > 0) {
        this.sealUrl = record.userInfo.sealUrl
      }
    },
    edit (record) {
      this.dialogTitle = '编辑'
      this.disable = false
      this.action = 'edit'
      this.visible = true
      getStationList({ id: record.departmentId }).then(res => {
        this.stationList = res.data
      })
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },

    handleProvinceChange (value) {
      // 获取部门下的岗位
      getStationList({ id: value })
        .then(rs => {
          this.stationList = rs.data
          this.form.setFieldsValue({ stationId: undefined })
        })
        .catch(error => {
          console.error(error)
        })
    },

    handleOk () {
      this.form.validateFields((err, values) => {
        if (err) {
          console.error('表单验证失败：', values)
          return
        }
        if (this.action === 'edit') {
          this.doEdit(values)
        } else if (this.action === 'add') {
          this.doAdd(values)
        }
      })
    },
    doAdd (values) {
      console.log('新增部门参数：', values)
      this.loading = true
      userAdd(values)
        .then(data => {
          if (data.code == 200) {
            this.$message.success('保存成功')
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {})
    },
    doEdit (values) {
      console.log('修改部门参数：', values)
      this.loading = true
      userModify(values)
        .then(data => {
          if (data.code == 200) {
            this.$message.success('修改成功')
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {})
    },

    handleCancel () {
      this.sealUrl = ''
      this.close()
    },
    close () {
      this.form.resetFields()
      this.visible = false
    }
  }
}
</script>

<style scoped>
.content-wrap {
  background: #ffffff;
}

.content-inner {
  width: 1300px;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 40px;
}

.inner-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  line-height: 2;
  letter-spacing: 10px;
}

.inner-topr {
  text-align: right;
  margin-right: 8px;
  font-size: 18px;
  font-weight: bold;
}

.div-date {
  margin-bottom: 16px;
}

.form-container {
  border: 1px solid #dddddd;
}

.row-item {
  float: left;
  padding: 10px;
  min-height: 50px;
}

.form-row ~ .form-row {
  border-top: 1px solid #ddd;
}

.row-item ~ .row-item {
  border-left: 1px solid #dddddd;
}

.wid-12 {
  width: 12%;
}

.wid-15 {
  width: 15%;
}

.wid-35 {
  width: 35%;
}

.wid-85 {
  width: 85%;
}

.form-footer {
  margin-top: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stamp {
  height: 38px;
  line-height: 38px;
  text-align: left;
}

.wdf-handle {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
}

.span-item ~ .span-item {
  margin-left: 14px;
}

.min-wid {
  min-width: 42px;
}

.crew {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>
