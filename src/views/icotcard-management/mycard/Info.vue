<template>
  <a-modal
    title="信息"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="detailFooter"
  >
    <template slot="footer">
      <template v-if="showDetailFooter">
        <a-button
          key="submit"
          type="primary"
        >保存</a-button>
      </template>
    </template>
    <a-tabs type="card" default-active-key="1" @change=changeTabs>
      <a-tab-pane key="1" tab="基本信息">
        <BaseInfo ref="baseInfo" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="消费详情">
        <ChargeInfo ref="chargeInfo" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="扣费信息">
        <ConsumeInfo ref="consumeInfo" />
      </a-tab-pane>
    </a-tabs>

  </a-modal>
</template>

<script>
import BaseInfo from './BaseInfo'
import ConsumeInfo from './ConsumeInfo'
import ChargeInfo from './ChargeInfo'
export default {
    name: 'icotcard-management-mycard-info',
    data(){
        return {
            visible:false,
            detailFooter:null,
            showDetailFooter:false,
            iccid:'',
            record:{},
        }
    },
    components:{
        BaseInfo,
        ConsumeInfo,
        ChargeInfo
    },
    methods:{
        handleCancel(){
          this.visible=false
        },
        showInfo(record){
          this.record=record
          this.iccid=record.iccid
          this.visible=true
          this.$nextTick(()=>{
            this.$refs.baseInfo.init(record)
          })
        },
        changeTabs(key){
          switch (key) {
            case '1':
              // 基本信息
              this.$nextTick(()=>{
                this.$refs.baseInfo.init(this.record)
              })
              break;
            case '2':
              // 消费详情
              this.$nextTick(()=>{
                this.$refs.chargeInfo.init(this.iccid)
              })
              break;
            case '3':
              // 扣费信息
              this.$nextTick(()=>{
                this.$refs.consumeInfo.init(this.iccid)
              })
              break;
          }
        },
    }
}
</script>

<style>

</style>