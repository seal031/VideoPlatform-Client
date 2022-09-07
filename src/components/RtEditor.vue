<template>
  <div>
    <div
      ref="editor"
      style="text-align:left"
    ></div>
  </div>
</template>

<script>
  import WangEditor from "wangEditor";
//   import { ACCESS_TOKEN } from '@/store/mutation-types'//系统中发送请求需要携带toekn,根据自己的项目决定
//   import Vue from 'vue'
  export default {
    name: "RtEditor",

    data() {
      return {
        // token: "",
        editorE:{}//编辑器的对象
      }
    },
    //接收v-model的值
    props: {
      value: String
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    mounted() {
      //初始化编辑框
      debugger
      this.init();
      this.editorE.txt.html(this.value)
    },
    created(){
    //   this.token = Vue.ls.get(ACCESS_TOKEN);//获取访问的token
    },

    watch:{
      value(val){//普通的watch监听
        debugger;
        if (val !== this.editorE.txt.html()) {
          this.editorE.txt.html(val)
        }
      },
      content(val) {
        debugger;
        this.$emit('input', val);
        }
    },

    methods: {
      init() {
        const _this = this;
        /*实例化*/
        _this.editorE = new WangEditor(_this.$refs.editor);
        _this.editorE.config.uploadImgServer = '/upload'
      // 配置 server 接口地址
        // _this.editorE.config.uploadImgServer = window._CONFIG['domianURL']+"/sys/common/upload"
        //设置富文本的高度
        _this.editorE.config.height = 400
        //默认限制图片大小是 5M
        _this.editorE.config.uploadImgMaxSize = 8 * 1024 * 1024 // 8M
        //自定义上传的参数
        _this.editorE.config.uploadFileName = 'file'
        //自定义头部token信息
        // _this.editorE.config.uploadImgHeaders = {
        //   "X-Access-Token":_this.token
        // }
        //设置请求参数
        // _this.editorE.config.uploadImgParams = {
        //   suffixPath: '@nowm' //后缀水印
        // }
        //timeout 即上传接口等待的最大时间，默认是 10 秒钟，可以自己修改
        _this.editorE.config.uploadImgTimeout = 3 * 1000
        _this.editorE.config.showLinkImg = true

        _this.editorE.config.uploadImgHooks = {
          // 上传图片之前
          before: function(xhr) {
            console.log(xhr)

          /*  // 可阻止图片上传
            return {
              prevent: true,
              msg: '需要提示给用户的错误信息'
            }*/
          },
          // 图片上传并返回了结果，图片插入已成功
          success: function(xhr) {
            //console.log('success', xhr)
          },
          // 图片上传并返回了结果，但图片插入时出错了
          fail: function(xhr, editor, resData) {
            console.log('fail', resData)
          },
          // 上传图片出错，一般为 http 请求的错误
          error: function(xhr, editor, resData) {
            console.log('error', xhr, resData)
          },
          // 上传图片超时
          timeout: function(xhr) {
            console.log('timeout')
          },
          // 图片上传并返回了结果，想要自己把图片插入到编辑器中
          // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        //   customInsert: function(insertImgFn, result) {
        //     // result 即服务端返回的接口
        //     console.log('customInsert', result)

        //     // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        //     insertImgFn(result.message)
        //   }
        }

        /*创建编辑器*/
        _this.editorE.create();

      // 监控变化，同步更新到文本 向上传递更新
        _this.editorE.config.onchange = function (html) {
          //console.log(html);
        //   debugger;
          _this.$emit("getWangEditorValue", html);
        }
      }
    }

  };
</script>
