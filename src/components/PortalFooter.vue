<template>
  <!-- TODO 版权信息 -->
  <div class="portal-footer">
    <div class="mb10 linh20">
      <span class="mr5">主办单位</span>
      <span class="mr5">:</span>
      <span class="mr5">教育工会及各高校 </span>
      <span class="mr5">版权所有@2022</span>
    </div>
    <div class="linh20">
      <span class="mr5">本站及所有内容系北京教育工会智慧平台建设研究成果，仅供测试使用，</span>
      <!-- <span class="mr5">版权所有</span> -->
      <span class="mr5">复制必究</span>
      <!-- <span>京ICP备09068819号</span> -->
    </div>
  </div>
</template>

<script>
export default {
  name:'PortalFooter'
};
</script>
<style scoped>
.linh20{
  height: 20px;
}
.portal-footer{
  text-align: center;
  margin: 20px 0 0px;
  padding: 20px;
  color: #5f6061;
  background-color: #cacaca;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  /* height: 100px */
}
</style>