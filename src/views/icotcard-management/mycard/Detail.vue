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
        <BaseDetail />
      </a-tab-pane>
      <a-tab-pane key="2" tab="消费详情">
        <ChargeDetail />
      </a-tab-pane>
      <a-tab-pane key="3" tab="扣费信息">
        <ConsumeDetail />
      </a-tab-pane>
    </a-tabs>

  </a-modal>
</template>

<script>
import BaseDetail from './BaseDetail'
import ConsumeDetail from './ConsumeDetail'
import ChargeDetail from './ChargeDetail'
export default {
    name: 'icotcard-management-mycard-detail',
    data(){
        return {
            visible:false,
            detailFooter:null,
            showDetailFooter:false,
            spinning:false,
        }
    },
    components:{
        BaseDetail,
        ConsumeDetail,
        ChargeDetail
    },
    methods:{
        handleCancel(){

        },
    }
}
</script>

<style>

</style>