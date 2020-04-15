<template>
  <div class="footer">
    <!-- <div class="links">
      <a
        href="https://pro.loacg.com/"
        target="_blank"
      >万德福官网 首页</a>
      <a
        href="http://www.xzwonderful.com"
        target="_blank"
      >
        <a-icon type="github" />
      </a>
      <a href="http://www.xzwonderful.com">Zwm Design</a>
      <a href="http://www.xzwonderful.com">Vue Zhangwenming</a>
    </div> -->
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2019 <span>万德福-前端团队-技术组出品</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
