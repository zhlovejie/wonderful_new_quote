<template>
  <a-modal 
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" :loading="spinning" @click="noPassAction" >不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <div class="recipes-wrapper">
        <a-form layout="inline" class="recipes-form">
          <p class="recipes-date-wrapper">
            <a-form-item label="选择日期">
              <a-range-picker 
                :disabled="isDisabled"
                :disabled-date="disabledDate"
                v-model="sDate"
                style="width:300px;"
                :allowClear="true"
                @change="dateChange"
              />
            </a-form-item>
          </p>
          <table class="custom-table custom-table-border" v-if="recipeList.length > 0">
            <tr>
              <th style="width:100px;">日期</th>
              <th style="width:150px;" v-for="item in recipeList" :key="item.key">{{item.date}}</th>
            </tr>
            <tr>
              <th style="width:100px;">星期</th>
              <th style="width:150px;" v-for="item in recipeList" :key="item.key">{{item.week}}</th>
            </tr>
          </table>

          <table
            class="custom-table custom-table-border"
            style="margin-top:-21px;"
            v-if="recipeList.length > 0 && recipeList[0].recipes.length > 0"
          >
            <tr
              class="recipes-title-tr"
              v-for="(item ,index) in recipeList[0].recipes.length"
              :key="item.key"
            >
              <th style="width:100px;">
                <div class="recipes-title">
                  菜单{{index + 1}}
                  <!-- <span class="recipes-action-delete" title="删除" @click="removeItem(index)">
                    <a-icon type="close-circle" />
                  </span> -->
                </div>
              </th>
              <th style="width:150px;" v-for="(recipe,__idx) in recipeList" :key="recipe.key">
                <a-form-item>
                  <a-input 
                    :disabled="isDisabled"
                    placeholder="输入菜单"
                    :value="recipe.recipes[index].name"
                    @input="recipeInputChange(__idx,recipe.recipes[index],$event)"
                  />
                </a-form-item>
              </th>
            </tr>
          </table>

          <!-- <a-button
            v-if="recipeList.length > 0"
            style="width:100%;"
            type="dashed"
            icon="plus"
            @click="addItem"
          >添加菜单</a-button> -->
        </a-form>
      </div>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>

import {
  canteenMenuDetail,
  canteenMenuAddAndUpdate,
  canteenMenuApprove,
  canteenMenuCheckDate
} from '@/api/canteenMenuManagement'
import Approval from './Approval'
import moment from 'moment'
export default {
  name: 'AddForm',
  components: {
    Approval: Approval
  },
  data() {
    return {
      sDate: [moment(), moment()],
      recipeList: [],
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}菜单`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      return Promise.all([])
    },
    disabledDate(current) {
      return current && current < this.moment().endOf("day");
    },
    async handleOk() {
      //debugger
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      let values = {}
      if (that.isEdit) {
        values.id = that.record.id
      }
      if(that.sDate.length === 2){
        values.startDate = that.sDate[0].format('YYYY-MM-DD')
        values.endDate = that.sDate[1].format('YYYY-MM-DD')
        if(that.isAdd){
          let isPass = await that.checkDate(values.startDate,values.endDate)
          if(!isPass){
            return
          }
        }
      }else{
        that.$message.info('您还没有选择日期')
        return
      }
      values.detailList = that.recipeList.map(item =>{
        let _item = {
          menuDate:item.date,
        }
        let m = {
          0:'menuOne',
          1:'menuTwo',
          2:'menuThree',
          3:'menuFour'
        }
        item.recipes.map((r,idx) =>{
          _item[m[idx]] = r.name
        })
        return _item
      })

      console.log(values)
      //提交
      that.spinning = true
      canteenMenuAddAndUpdate(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.visible = false
          that.$message.info(res.msg)
          if(res.code === 200){
            that.$emit('finish')
          }
        })
        .catch(err => (that.spinning = false))
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.resetData()
      that.actionType = type
      that.record = record || {}
      await that.init()
      that.visible = true
      that.sDate = [that.moment(), that.moment()],
      that.recipeList = []

      if (that.isAdd) {
        that.sDate = that.initDate();
        that.initRecipeList();
        that.addItem()
        that.addItem()
        that.addItem()
        that.addItem()
        return 
      }
      //填充数据
      canteenMenuDetail({ id: that.record.id }).then(res => {
        console.log(res)
        let data = res.data
        let weekMap = ["日", "一", "二", "三", "四", "五", "六"];
        that.sDate = [that.moment(data.startDate),that.moment(data.endDate)]
        data.detailList.map(item =>{
          that.recipeList.push({
            key: that.makeUUID(),
            date: item.menuDate,
            week: `星期${weekMap[that.moment(item.menuDate).weekday()]}`,
            recipes: ['menuOne','menuTwo','menuThree','menuFour'].map(m => {
              return {
                key: that.makeUUID(),
                id: item.id,
                name: item[m]
              }
            })
          })
        })
      })
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      canteenMenuApprove(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },
    resetData(){
      let that = this
    },
    initDate() {
      const weekDay = this.moment().weekday();
      const sDate = this.moment().add({ days: 7 - weekDay + 1 });
      const eDate = this.moment(sDate).add({ days: 6 });
      return [sDate, eDate];
    },
    makeUUID() {
      return Math.random().toString(32).slice(-10);
    },
    addItem() {
      let that = this;
      if (
        that.recipeList.length > 0 &&
        that.recipeList[0].recipes.length >= 4
      ) {
        that.$message.info("目前只支持最多4个菜单");
        return;
      }
      let recipeList = [...that.recipeList];
      recipeList.map(item => {
        item.recipes.push({
          key: that.makeUUID(),
          id: undefined,
          name: undefined
        });
      });
      that.recipeList = [...recipeList];
    },
    removeItem(idx) {
      let that = this;
      let recipeList = [...that.recipeList];
      recipeList.map(item => {
        item.recipes.splice(idx, 1);
        return item;
      });
      that.recipeList = [...recipeList];
    },
    async dateChange(arrMoments, arrStr) {
      let that = this
      if (Array.isArray(arrMoments) && arrMoments.length === 2) {
        let diff = arrMoments[1].diff(arrMoments[0], "days");
        if (diff > 7) {
          this.$message.info("最大支持选择7天");
          return;
        }
      }

      if(Array.isArray(arrStr) && arrStr.length === 2 && arrStr[0] && arrStr[1]){
        let isPass = await that.checkDate(arrStr[0],arrStr[1])
        if(isPass){
          that.initRecipeList();
          that.addItem()
          that.addItem()
          that.addItem()
          that.addItem()
        }
      }
    },
    initRecipeList() {
      let that = this;
      let result = [];
      let weekMap = ["日", "一", "二", "三", "四", "五", "六"];

      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        let sDate = this.sDate[0],
          eDate = this.sDate[1];
        let i = 0,
          len = eDate.diff(sDate, "days");
        for (; i <= len; i++) {
          let tmpDate = moment(sDate).add({ days: i });
          result.push({
            key: that.makeUUID(),
            date: tmpDate.format("YYYY-MM-DD"),
            week: `星期${weekMap[tmpDate.weekday()]}`,
            recipes: []
          });
        }
      }

      that.recipeList = [...result];
    },
    recipeInputChange(idx, item, event) {
      let that = this;
      let recipeList = [...this.recipeList];
      let target = recipeList[idx].recipes.find(r => r.key === item.key);
      if (target) {
        target.name = event.target.value;
        that.recipeList = [...recipeList];
      }
    },
    checkDate(startDate,endDate){
      let that = this
      return canteenMenuCheckDate({startDate:startDate,endDate:endDate }).then(res =>{
        if(res.code === 200){
          return true
        }else{
          that.$message.info(res.msg)
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/*自定义table样式*/
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.custom-table-border {
  caption {
    text-align: center;
    padding: 10px 0;
    font-size: 125%;
    font-weight: bold;
    caption-side: initial;
    color: inherit;
  }
  th,
  td {
    border: 1px solid #d8d8d8;
    padding: 10px 5px;
    text-align: center;
  }
}
</style>
<style scoped>
.recipes-wrapper >>> .ant-form-item {
  margin: 0;
}
.recipes-wrapper >>> .ant-form-item .ant-input {
  text-align: center;
}
.recipes-date-wrapper {
  background-color: #f5f5f5;
  padding: 20px;
  margin: 0;
  border-radius: 3px;
}
.recipes-title {
  position: relative;
  display: inline-block;
}

.recipes-title .recipes-action-delete {
  position: absolute;
  top: 0;
  right: -20px;
  opacity: 0;
  transition: all 0.2s linear;
  cursor: pointer;
  color: red;
}

.recipes-title-tr:hover >>> .recipes-action-delete {
  opacity: 1;
}
</style>