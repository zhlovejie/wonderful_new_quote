<template>
  <div class="content-wrap">
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">货物合同</a-col>
      </a-row>

      <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="12">
          <template v-if="!isSee">
            <a-button
              style="float:right;"
              type="primary"
              icon="plus"
              @click="applyFor('add',null)"
            >新增</a-button>
          </template>
          <table class="custom-table custom-table-border" style="margin-top:20px">
            <tr>
              <th>
                <b>文件名称</b>
              </th>
              <th>
                <b>操作</b>
              </th>
            </tr>
            <tr v-for="(item,index) in goodsList " :key="index">
              <td>{{item.name}}</td>
              <td>
                <a class="ant-dropdown-link" @click="delete_list(item.url)">查看</a>
                <a-divider type="vertical" />
                <a class="ant-dropdown-link" :href="item.url" target="_blank">下载</a>
                <template v-if="!isSee">
                  <a-divider type="vertical" />
                  <a class="ant-dropdown-link" @click="deletes(index)">删除</a>
                </template>
              </td>
            </tr>
          </table>
        </a-col>
      </a-row>

      <a-form class="form wdf-form">
        <a-form-item class="btns-grop" style="border-left: none">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
          <template v-if="!isSee">
            <a-button type="primary" @click="nextStep()">保存</a-button>
          </template>
          <template v-else>
            <a-button type="primary" @click="next()">退出</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <Appform ref="normalUpload" @msgId="specialList" />
    <XdocView ref="xdocView" />
  </div>
</template>

<script>
import { logisticsPreservation } from '@/api/distribution-management'
import Appform from './Appform'
import XdocView from './XdocView'
export default {
  name: 'Step5',
  components: { Appform, XdocView },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      goodsList: [],
      isProductOrder: false,
      queryonedata1: {},
      isSee: false,
    }
  },
  computed: {},
  watch: {
    queryonedata: function (newVal, oldVal) {
      this.queryonedata1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
  },
  mounted() {
    if (this.queryonedata1.logisticsGoodsContracts) {
      this.goodsList = this.queryonedata1.logisticsGoodsContracts
    }
    if (this.$parent.routeParams.typeName === 'see') {
      this.isSee = true
    }
  },
  methods: {
    applyFor() {
      //打开新增上传模板
      this.$refs.normalUpload.query()
    },
    specialList(data) {
      //接收子组件传的数据
      this.goodsList.push(data)
    },
    deletes(id) {
      this.goodsList.splice(id)
    },
    delete_list(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    //退出
    next() {
      this.$router.push({ name: 'distribution_logistics' })
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
      let params = {
        logisticsGoodsContracts: that.goodsList,
      }
      let valuer = { ...that.queryonedata, ...params }
      if (that.goodsList.length > 0) {
        logisticsPreservation(valuer).then((res) => {
          if (res.code === 200) {
            that.$message.info(res.msg)
            this.$router.push({ name: 'distribution_logistics' })
          } else {
            that.$message.info(res.msg)
          }
        })
      } else {
        that.$message.error('货物合同不能为空！')
      }
    },
    // 上一步
    prevStep() {
      this.$emit('prevStep')
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
  padding: 10px;
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
.label-fix {
  display: inline-block;
  width: 50%;
  text-align: left;
  position: relative;
  top: 8px;
}
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  border: none;
}

.custom-table > .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table > .custom-table td {
  text-align: left;
}
</style>
