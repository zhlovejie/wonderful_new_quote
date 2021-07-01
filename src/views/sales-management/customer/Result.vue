<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <result
        :title="msg"
        :type="+code === 200 ? 'success' : 'error'"
        description=""
        style="max-width: 560px;"
      >
        <div slot="action">
          <a-button
            v-if="subType == 'add'"
            type="primary"
            @click="addAgain"
          >继续添加</a-button>
          <a-button
            style="margin-left: 8px"
            @click="toList"
          >查看列表</a-button>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'Step3',
  props: {
    subType: { required: true, type: String }
  },
  components: {
    Result
  },
  data() {
    return {
      msg: '',
      code: '',
      loading: false
    }
  },
  methods: {
    /**
     * 结果页面
     * @param res 处理结果
     */
    result(res) {
      this.msg = res.msg
      this.code = res.code
    },
    addAgain() {
      this.$emit('addAgain')
    },
    toList() {
      this.$emit('toList')
    }
  }
}
</script>
<style lang="less" scoped>
.information {
  line-height: 22px;

  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
.money {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
}
</style>
