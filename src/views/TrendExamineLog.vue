<template>
    <div class="container">
        <div style="width: 100%; height: 100%">
            <el-table
            :data="examineRecordList"
            border
            style="width: 100%; height: 100%"
            >
            <el-table-column
                prop="examine_time"
                label="时间"
                width="200"
                :formatter="dateFormat"
            ></el-table-column>
            <el-table-column prop="examine_by" label="用户名">
            </el-table-column>
            <el-table-column prop="examine_state" label="操作" width="200">
            </el-table-column>
            </el-table>
        </div>  
    </div>
</template> 

<script>
import moment from "moment";
import { ref,onMounted } from '@vue/runtime-core';
import { getExamineByTrendId} from "../api/serviceApi";
import { useRoute, useRouter } from "vue-router";

export default {
    props:{
        trendId:{
        type: String ,
        default:""
        },
        dialogVisible:{
        type:Boolean,
        default:false
        }
    },
    setup(props){
        let route = useRoute(); //可以在setup中使用route获取参数
        let userId = "";
        let userRole = "";
        let userName = "";
        let realName = ref("");
        let userSchool = "";
        //数据模型列表
        let examineRecordList = ref([]);
        debugger;
        let trendId = props.trendId;
        let trend=ref();

        const getSession = () => {
            userId = localStorage.getItem("user_id");
            userRole = localStorage.getItem("user_role");
            userName = localStorage.getItem("user_name");
            realName.value = localStorage.getItem("real_name");
            userSchool = localStorage.getItem("user_school");
        };
        const getExamineRecord=(trendId)=>{
            if (trendId != undefined) {
                let params = {
                    params: {
                        trend_id: trendId,
                    },
                };
                getExamineByTrendId(params).then((res) => {
                    debugger;
                    examineRecordList.value=JSON.parse(res.data.ExamineRecordList);
                    trend=res.data.trend;
                });
            }
        };
        onMounted(()=>{
            getSession();
            methods.getParams();
            getExamineRecord(trendId);
        });   
        const dateFormat=(date)=>{
            return moment(date.examine_time).format("YYYY-MM-DD HH:mm:ss");
        };
        const methods = {
            getParams() {
                // debugger;
                // trendId = route.query.trendId;
            },
        }

        return{   
            userId,
            userRole,
            userName,
            realName,
            userSchool,

            examineRecordList,
            trendId,
            trend,
            getSession,
            getExamineRecord,
            methods,
            dateFormat,
        }
    }
}
</script>