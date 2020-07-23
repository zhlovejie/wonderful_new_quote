<template>
  <a-modal
    title="信息"
    :width="700"
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
          :loading="spinning"
        >保存</a-button>
      </template>
    </template>
    <a-tabs type="card" default-active-key="1">
      <a-tab-pane key="1" tab="基本信息">
        <BaseInfo ref="baseInfo" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="消费详情">
        <ChargeInfo />
      </a-tab-pane>
      <a-tab-pane key="3" tab="扣费信息">
        <ConsumeInfo />
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
            spinning:false,
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
        showInfo(iccid){
          this.visible=true
          this.$nextTick(()=>{
            this.$refs.baseInfo.init(iccid)
          })
        }
    }
}
</script>

<style>

</style>