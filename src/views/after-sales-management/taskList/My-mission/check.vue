<template>
  <a-modal
    title="验收单明细"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">保存</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-form-item v-if="!isVeiw" label="验收类型">
          <a-select
            v-decorator="['acceptanceType', { rules: [{ required: true, message: '请选泽验收类型！' }] }]"
            allowClear
            placeholder="验收类型"
          >
            <a-select-option :value="0">全部验收</a-select-option>
            <a-select-option :value="1"> 部分验收</a-select-option>
          </a-select>
        </a-form-item>

        <h3 style="margin-top: 15px">
          验收单 <span style="margin-left: 40px"> <a @click="checkAdd" v-if="!isVeiw">新增</a> </span>
        </h3>
        <table
          class="custom-table custom-table-border"
          v-for="(item, index) in acceptanceCheckVoList"
          :key="item.index"
        >
          <a-button type="primary" v-if="item.createdName" style="margin-bottom: 15px; margin-top: 15px" shape="round">
            {{ item.createdName }}-{{ item.createdTime }}
          </a-button>
          <span style="margin-left: 15px"><a v-download="item.acceptanceUrl">验收单</a></span>
          <!-- <a-button v-if="item.acceptanceUrl" shape="round" type="link" @click="problemdel(index)">验收单 </a-button> -->
          <tr>
            <th>序号</th>
            <th>产品名称</th>
            <th>数量（台）</th>
          </tr>
          <tr v-for="(i, index) in item.acceptanceProductList" :key="i.index">
            <td>
              {{ index + 1 }}
            </td>
            <td>{{ i.productName }}</td>
            <td>{{ i.quantity }}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="2">{{ item.remark }}</td>
          </tr>
        </table>
        <h3 v-if="!isVeiw">未验收明细:</h3>
        <table v-if="!isVeiw" class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>产品名称</th>
            <th>数量（台）</th>
          </tr>
          <tr v-for="(item, index) in opinionData" :key="item.index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </table>
      </a-form>
      <ProblemForm ref="problemForm" @opinionChange="opinionChange" />
      <ProblemForm1 ref="problemForm1" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { acceptanceCheckTaskDocument, acceptanceCheckDetail } from '@/api/after-sales-management' //机构名称
import ProblemForm from './mode/detailed'
import ProblemForm1 from './mode/detailed1'
export default {
  name: 'BecomingForm',
  components: {
    ProblemForm,
    ProblemForm1,
  },
  data() {
    return {
      record: {},
      visible: false,
      spinning: false,
      addShow: false,
      type: 'add',
      fileUrl: false,
      userInfo: this.$store.getters.userInfo,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      AfterSale: [],
      opinionData: [],
      acceptanceCheckVoList: [],
    }
  },
  computed: {
    isAdd() {
      //查看
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'handle'
    },
    isDisabled() {
      return this.isVeiw
    },
  },

  created() {},
  methods: {
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      acceptanceCheckDetail({ id: record.id }).then((res) => {
        this.opinionData = res.data.acceptanceProductCheckVoList
        this.acceptanceCheckVoList = res.data.acceptanceCheckVoList
      })
    },
    opinionChange(data) {
      console.log(data)
      this.acceptanceCheckVoList.push(data)
    },
    checkAdd() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.acceptanceType === 1) {
            this.$refs.problemForm.query('add', {
              ...values,
              ...{ data: this.opinionData, taskDocumentId: this.record.id },
            })
          } else {
            this.$refs.problemForm1.query('add', {
              ...values,
              ...{ data: this.opinionData, taskDocumentId: this.record.id },
            })
          }
        }
      })
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      if (this.isVeiw) {
        return (that.visible = false)
      }
      if (that.type === 'add') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              acceptanceSaveBoList: this.acceptanceCheckVoList,
              acceptanceType: values.acceptanceType,
              taskDocumentId: this.record.id,
              acceptanceProductCheckVoList: this.opinionData,
            }
            that.spinning = true
            acceptanceCheckTaskDocument(params)
              .then((res) => {
                that.spinning = false
                console.log(res)
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('filet')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
    },
    handleCancel() {
      this.opinionData = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
  padding: 15px 10px;
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
</style>