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
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="addform-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">巷道代码</td>
            <td>
              <a-form-model-item prop="roadwayCode" v-if="!isDisabled">
                <a-input v-model="form.roadwayCode" />
              </a-form-model-item>
              <span v-else>
                {{ detail.roadwayCode }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">巷道名称</td>
            <td>
              <a-form-model-item prop="roadwayName" v-if="!isDisabled">
                <a-input v-model="form.roadwayName" />
              </a-form-model-item>
              <span v-else>
                {{ detail.roadwayName }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 200px" class="requiredMark">状态</td>
            <td>
              <a-form-model-item prop="roadwayStatus" v-if="!isDisabled">
                <a-select v-model="form.roadwayStatus">
                  <a-select-option :value="1">正常</a-select-option>
                  <a-select-option :value="2">锁定</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseName === 1 ? '正常' : '锁定' }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 200px" class="requiredMark">伸展方向</td>
            <td>
              <a-form-model-item prop="growDirection" v-if="!isDisabled">
                <a-select v-model="form.growDirection">
                  <a-select-option :value="0">双向</a-select-option>
                  <a-select-option :value="1">单向左</a-select-option>
                  <a-select-option :value="2">单向右</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.growDirection === 0 ? '双向' : detail.growDirection === 1 ? '单向左' : '单向右' }}
              </span>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-input v-model="form.remark" type="textarea" />
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
import { roadwayAddOrUpdate, roadwaygetDetailById } from '@/api/storage'
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'

export default {
  name: 'EnterpriseSynopsis',
  components: {
    DepartmentUserCascade,
  },
  data() {
    return {
      Warehouse: [],
      visible: false,
      confirmLoading: false,
      addOredit: 'add',
      record: {},
      form: {},
      detail: {},
      rules: {
        roadwayStatus: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        growDirection: [{ required: true, message: '请选择伸展方向', trigger: 'change' }],
        roadwayCode: [{ required: true, message: '请输入巷道代码', trigger: 'blur' }],
        roadwayName: [{ required: true, message: '请输入巷道名称', trigger: 'blur' }],
      },
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
      this.form.remark = ''
      if (type !== 'add') {
        let that = this
        roadwaygetDetailById({ id: record.id })
          .then((res) => {
            that.spinning = false
            that.detail = res.data
            that.form = {
              ...that.detail,
            }
          })
          .catch((err) => {
            that.spinning = false
            that.$message.error(err)
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
          let { remark, roadwayStatus, roadwayCode, roadwayName, growDirection } = _this.form
          let baseInfo = {
            remark,
            roadwayStatus,
            roadwayCode,
            roadwayName,
            growDirection,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          roadwayAddOrUpdate(baseInfo)
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
    },
    previewCancel() {
      this.previewVisible = false
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields() // 清空表
      this.visible = false
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
