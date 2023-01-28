<template>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 系统开放管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统开放参数配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-form>
                <el-row>
                    <el-col :span="24">
                        <el-form-item>
                            {{externalSystemFormQJS.data.external_name }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="1"></el-col>
                    <el-col :span="2">
                        <el-form-item>
                            访问地址:
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <el-form-item>
                            <el-input
                            v-model="externalSystemFormQJS.data.external_url"
                            placeholder="请输入外部系统地址"
                            class="handle-input mr10"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            是否开放:
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-switch v-model="externalSystemFormQJS.data.is_open" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item>
                            {{externalSystemFormQGS.data.external_name }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="1"></el-col>
                    <el-col :span="2">
                        <el-form-item>
                            访问地址:
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <el-form-item>
                            <el-input
                            v-model="externalSystemFormQGS.data.external_url"
                            placeholder="请输入外部系统地址"
                            class="handle-input mr10"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            是否开放:
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-switch v-model="externalSystemFormQGS.data.is_open" />
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row>
                    <el-col :span="24">
                        <el-form-item>
                            {{externalSystemFormSDBY.data.external_name }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="1"></el-col>
                    <el-col :span="2">
                        <el-form-item>
                            访问地址:
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <el-form-item>
                            <el-input
                            v-model="externalSystemFormSDBY.data.external_url"
                            placeholder="请输入外部系统地址"
                            class="handle-input mr10"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            是否开放:
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-switch v-model="externalSystemFormSDBY.data.is_open" />
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row>
                    <el-col :span="24">
                        <el-form-item>
                            {{externalSystemFormZYZ.data.external_name }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="1"></el-col>
                    <el-col :span="2">
                        <el-form-item>
                            访问地址:
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <el-form-item>
                            <el-input
                            v-model="externalSystemFormZYZ.data.external_url"
                            placeholder="请输入外部系统地址"
                            class="handle-input mr10"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            是否开放:
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-switch v-model="externalSystemFormZYZ.data.is_open" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">

                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" :icon="Search" @click="SaveExternalSystemList"
                            >保存</el-button
                            >
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">

                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {addExternalSystemList,getExternalSystemList} from "../api/serviceApi";
export default {
    name: "externalSystemList",
    setup(){
        //数据模型
        const initExternalSystemFormDataQJS={
            external_id: null,
            external_name: "",
            external_url: "",
            is_open: false,
        };
        let externalSystemFormQJS = reactive({
            data: JSON.parse(JSON.stringify(initExternalSystemFormDataQJS)),
        });
        const initExternalSystemFormDataQGS={
            external_id: null,
            external_name: "",
            external_url: "",
            is_open: false,
        };
        let externalSystemFormQGS = reactive({
            data: JSON.parse(JSON.stringify(initExternalSystemFormDataQGS)),
        });
        const initExternalSystemFormDataSDBY={
            external_id: null,
            external_name: "",
            external_url: "",
            is_open: false,
        };
        let externalSystemFormSDBY = reactive({
            data: JSON.parse(JSON.stringify(initExternalSystemFormDataSDBY)),
        });
        const initExternalSystemFormDataZYZ={
            external_id: null,
            external_name: "",
            external_url: "",
            is_open: false,
        };
        let externalSystemFormZYZ = reactive({
            data: JSON.parse(JSON.stringify(initExternalSystemFormDataZYZ)),
        });

        const SaveExternalSystemList=(()=>{
            externalSystemFormQJS.data.is_open=externalSystemFormQJS.data.is_open==false?0:1;
            externalSystemFormQGS.data.is_open=externalSystemFormQGS.data.is_open==false?0:1;
            externalSystemFormSDBY.data.is_open=externalSystemFormSDBY.data.is_open==false?0:1;
            externalSystemFormZYZ.data.is_open=externalSystemFormZYZ.data.is_open==false?0:1;
            addExternalSystemList(externalSystemFormQJS.data).then((res)=>{});
            addExternalSystemList(externalSystemFormQGS.data).then((res)=>{});
            addExternalSystemList(externalSystemFormSDBY.data).then((res)=>{});
            addExternalSystemList(externalSystemFormZYZ.data).then((res)=>{});
        });

        onMounted(() => {
            getExternalSystemList().then((res)=>{
                let allExternalSystemList=JSON.parse(res.data.ExternalSystemList);
                debugger;
                externalSystemFormQJS.data=allExternalSystemList[0];
                externalSystemFormQJS.data.is_open=externalSystemFormQJS.data.is_open==0?false:true;
                externalSystemFormQGS.data=allExternalSystemList[1];
                externalSystemFormQGS.data.is_open=externalSystemFormQGS.data.is_open==0?false:true;
                externalSystemFormSDBY.data=allExternalSystemList[2];
                externalSystemFormSDBY.data.is_open=externalSystemFormSDBY.data.is_open==0?false:true;
                externalSystemFormZYZ.data=allExternalSystemList[3];
                externalSystemFormZYZ.data.is_open=externalSystemFormZYZ.data.is_open==0?false:true;
            });
        });

        return{
            initExternalSystemFormDataQJS,
            externalSystemFormQJS,
            initExternalSystemFormDataQGS,
            externalSystemFormQGS,
            initExternalSystemFormDataSDBY,
            externalSystemFormSDBY,
            initExternalSystemFormDataZYZ,
            externalSystemFormZYZ,

            SaveExternalSystemList,
        };
    },
}
</script>
