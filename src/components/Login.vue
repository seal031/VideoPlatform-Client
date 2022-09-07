<template>
    <div >
      <el-container style="">
        <el-header>
          <div class="demo-image__placeholder">
            <div class="block">
              <span class="demonstration"></span>
              <el-image :src="src" style="background-size: 100% 100%;
                background-position: center center;
                overflow: auto;">
                <div :v-slot="placeholder" class="image-slot">
                  <span class="dot"></span>
                </div>
              </el-image>
            </div>
          </div>
        </el-header>
        <el-main style="width: 100%;margin-top: 200px">

          <el-row :gutter="10">
            <el-col :xs="4" :sm="5" :md="6" :lg="7" :xl="8"> <div class="" style="width: 100%;" >
              <input type="text"   style="visibility: hidden;"  >
            </div></el-col>
            <el-col :xs="16" :sm="14" :md="12" :lg="10" :xl="8">
              <div
                class="demo-input-size"
                style="background-color: #EBEEF5;width: 100%;height: 300px;border-radius: 4px" >
                <div
                  style="padding-top: 20px"><font size="6">登录</font></div>
                <div
                  style="padding-top: 40px;padding-right: 50px">
                  <!--                    ref="form"-->
                  <!--                    :model="form"-->
                  <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    size=""
                    status-icon="true">
                    <el-form-item label="用户名:" prop="username">
                      <el-input
                        size="medium"
                        resize="vertical"
                        v-model="ruleForm.username"
                        placeholder="请输入用户名称"
                        suffix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                      <el-input
                        size="medium"
                        v-model="ruleForm.password"
                        placeholder="请输入密码"
                        show-password
                        suffix-icon="el-icon-key"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        size="medium"
                        style="width: 100%"
                        round
                        type="primary"
                        @click="onSubmit('ruleForm')" >登录</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-col>
            <el-col :xs="4" :sm="5" :md="6" :lg="7" :xl="8"> <div class="" style="width: 100%;" ></div></el-col>
          </el-row>
        </el-main>
      </el-container>

    </div>
</template>

<script>
  export default {
    name:'Login',
    data() {
      return {
        ruleForm: {
          username: '',
          password:'',
        },
        src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        rules: {
          username: [
            //表单验证
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ]
        }

      }
    },
    methods: {
      //async 异步提交
      async onSubmit() {
        var that = this
        console.log('submit!');
        console.log(that.ruleForm.username,that.ruleForm.password);
        console.log(this.ruleForm)
        try{
          //发送请求，并将model参数传递过去
          const result = await  this.$http.get('/login',{
            params:that.ruleForm
          })
          //打印获取的信息
          console.log(result)
          if (result['code'] == '0'){
              // alert(result['message']);
            //进行token数据存储
            this.$store.commit('settoken',result['token'])

            //将token保存到本地持久化存储，相当于后台的会话session
            window.localStorage.setItem('token',result['token'])
            //添加提示信息即message 这个信息应该是前端提示的，毕竟是前后端分离了
            //这个信息应该是token里面进行正则提取才对，技术有限，先这样  这个不用进行本地持久存储，因为调到另一个页面就要进行读取然后消除了
            this.$store.commit('setMessage',result['message'])
            console.log(result['token'])
            //进行页面跳转
            //一般这里还需要判断是否有上一个页面存在，如果有登录成功后返回原先页面，如果没有直接跳转主页
            this.$router.replace({path:'/manage/index'})

          }else {
            alert(result['message']+'  发生错误了');
          }

        }catch (e) {
          console.log(e)
        }
      },
      // read(){
      //   alert(this.$store.state.message)
      // }
    },
    //vue2 钩子函数 在组件渲染完成后执行
    // beforeUpdate(){
    //   this.read();
    //   //清除信息
    //   this.$store.setItem('setMessage','');
    // }
  }
</script>

<style scoped>

</style>

