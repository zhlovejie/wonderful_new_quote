<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="reservoform" class="addform-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">库区代码</td>
            <td>
              <a-form-model-item
                prop="reservoirCode"
                :rules="{
                  required: true,
                  message: '请输入库区代码',
                  trigger: 'blur',
                }"
                v-if="!isDisabled"
              >
                <a-input :disabled="AshSetting" v-model="reservoform.reservoirCode" />
              </a-form-model-item>
              <span v-else>
                {{ detail.reservoirCode }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">库区名称</td>
            <td>
              <a-form-model-item
                prop="reservoirName"
                :rules="{
                  required: true,
                  message: '请输入库区名称',
                  trigger: 'blur',
                }"
                v-if="!isDisabled"
              >
                <a-input :disabled="AshSetting" v-model="reservoform.reservoirName" />
              </a-form-model-item>
              <span v-else>
                {{ detail.reservoirName }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 200px" class="requiredMark">所属仓库</td>
            <td>
              <a-form-model-item
                prop="warehouseId"
                :rules="{
                  required: true,
                  message: '请选择所属仓库',
                  trigger: 'change',
                }"
                v-if="!isDisabled"
              >
                <a-select :disabled="AshSetting" v-model="reservoform.warehouseId">
                  <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
                    item.warehouseName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseName }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">负责人</td>
            <td>
              <a-form-model-item
                prop="applyUser"
                :rules="{
                  required: true,
                  message: '请选择负责人',
                  trigger: 'change',
                }"
                v-if="!isDisabled"
              >
                <DepartmentUserCascade allowClear :info.sync="reservoform.applyUser" />
              </a-form-model-item>
              <span v-else> {{ detail.headDepartmentName }}----{{ detail.headUserName }} </span>
            </td>
          </tr>
          <tr>
            <td>负责人电话</td>
            <td>
              <span>
                {{ reservoform.applyUser && reservoform.applyUser.mobile ? reservoform.applyUser.mobile : '系统带入' }}
              </span>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-input v-model="reservoform.remark" type="textarea" />
              </a-form-model-item>
              <span v-else>
                {{ detail.remark }}
              </span>
            </td>
          </tr>
        </table>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { getList, ReservoiAddOrUpdatee, ReservoigetDetailById, ReservoidelValidation } from '@/api/storage'
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'

export default {
  name: 'EnterpriseSynopsis',
  components: {
    DepartmentUserCascade,
  },
  data() {
    return {
      Warehouse: [],
      warehouseList: [],
      visible: false,
      AshSetting: false,
      confirmLoading: false,
      addOredit: 'add',
      record: {},
      reservoform: {},
      detail: {},
    }
  },

  computed: {
    modalTitle() {
      let txt = this.isView ? '查看' : this.isEdit ? '修改' : '新增'
      return `${txt}`
    },
    isView() {
      return this.addOredit === 'view'
    },
    isAdd() {
      return this.addOredit === 'add'
    },
    isEdit() {
      //修改
      return this.addOredit === 'edit'
    },
    isDisabled() {
      return this.isView
    },
  },
  methods: {
    async query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = record
      this.reservoform.remark = ''
      getList().then((res) => {
        this.warehouseList = res.data
      })
      if (type !== 'add') {
        let that = this
        ReservoigetDetailById({ id: record.id })
          .then((res) => {
            that.spinning = false
            that.detail = res.data
            that.reservoform = {
              ...that.detail,
              applyUser: {
                depId: that.detail.headDepartmentId,
                depName: that.detail.headDepartmentName,
                userId: that.detail.headUserId,
                userName: that.detail.headUserName,
                mobile: that.detail.headUserPhone,
              },
            }
          })
          .catch((err) => {
            that.spinning = false
            that.$message.error(err)
          })
        ReservoidelValidation({ id: record.id }).then((res) => {
          if (+res.code === 500) {
            this.AshSetting = true
          }
        })
      }
    },

    close() {
      this.$emit('ok')
      this.$refs.ruleForm.resetFields() // 清空表
      this.visible = false
    },
    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      _this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let { depId, depName, userId, userName, mobile } = _this.reservoform.applyUser
          let { remark, warehouseId, reservoirCode, reservoirName } = _this.reservoform
          let react = this.warehouseList.find((i) => i.id === warehouseId)
          let baseInfo = {
            remark,
            warehouseId,
            reservoirCode,
            reservoirName,
            headUserPhone: mobile,
            headDepartmentId: depId,
            headDepartmentName: depName,
            headUserId: userId,
            headUserName: userName,
            warehouseName: react.warehouseName,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          ReservoiAddOrUpdatee(baseInfo)
            .then((res) => {
              if (res.code == 200) {
                _this.close()
                _this.confirmLoading = false
                _this.$message.success('保存成功')
              } else {
                _this.confirmLoading = false
                _this.$message.error(res.msg)
              }
            })
            .catch(() => {})
        }
      })
      // 触发表单验证
      // this.form.validateFields((err, values) => {
      //   // 验证表单没错误
      //   if (!err) {
      //     if (this.isEdit) {
      //       values.id = this.record.id
      //     }

      //   }
      // })
    },
    previewCancel() {
      this.previewVisible = false
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped >
/* you can make up upload button and sample style by using stylesheets */
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
.ant-form-item {
  margin-bottom: 0;
}
</style>
