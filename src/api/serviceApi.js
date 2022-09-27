import axios from '../utils/axios'

export function getUserBySchoolId(params){
    return axios.get('/GlobalCode/GetUserBySchoolId',params);
}
export function getUserById(params){
    return axios.get('/GlobalCode/GetUserById',params);
}
export function addUser(params){
    return axios.post('/GlobalCode/AddUser',params);
}
export function delUser(params){
    return axios.post('/GlobalCode/DelUser',{},params);
}

export function getVideoType(params){
    return axios.get('/GlobalCode/GetVideoType',params);
}
export function addVideoType(params){
    return axios.get('/GlobalCode/AddVideoType',params);
}
export function getVideoPublicType(params){
    return axios.get('/GlobalCode/GetVideoPublicType',params);
}
export function addVideoPublicType(params){
    return axios.get('/GlobalCode/AddVideoPublicType',params);
}
export function getColumnType(params){
    return axios.get('/GlobalCode/GetColumnType',params);
}
export function addColumnType(params){
    return axios.get('/GlobalCode/AddColumnType',params);
}
export function getSchoolType(params){
    return axios.get('/GlobalCode/GetSchoolType',params);
}
export function getSchoolCategoryType(params){
    return axios.get('/GlobalCode/GetSchoolCategoryType',params);
}
export function addchoolType(params){
    return axios.get('/GlobalCode/AddSchoolType',params);
}
/////////////////////公共参数 END //////////////////////

export function getSchoolList(params){
    return axios.get('/School/GetSchoolList',params);
}
export function getSchoolById(params){
    return axios.get('/School/GetSchoolById',params);
}
export function addSchool(params){
    return axios.post('/School/AddSchool',params);
}
export function delSchool(params){
    return axios.post('/School/DelSchool',{},params);
}
////////////////////////学校 END/////////////////

export function addViewHistory(params){
    return axios.post('/Video/AddViewHistory',{},params);
}
export function addAppreciate(params){
    return axios.post('/Video/AddAppreciate',{},params);
}
export function addCollection(params){
    return axios.post('/Video/AddCollection',{},params);
}
export function cancelAppreciate(params){
    return axios.post('/Video/CancelAppreciate',{},params);
}
export function cancelCollection(params){
    return axios.post('/Video/CancelCollection',{},params);
}
export function getCollectionAppreciateState(params){
    return axios.post('/Video/GetCollectionAppreciateState',{},params);
}
export function getVideoList(params){
    return axios.get('/Video/GetVideoList',params);
}
export function getVideoById(params){
    return axios.get('/Video/GetVideoById',params);
}
export function addVideo(params){
    return axios.post('/Video/AddVideo',params);
}
export function getRelativeVideoList(params){
    return axios.get('/Video/GetRelativeVideoList',params);
}
export function getCollectVideoList(params){
    return axios.get('/Video/GetCollectVideoList',params);
}
export function getVideoUploadInfo(params){
    return axios.get('/Upload/GetVideoUploadInfo',params);
}
export function getVideoPlayAuth(params){
    return axios.get('/Video/GetVideoPlayAuth',params);
}
export function deleteAliyunVideo(params){
    return axios.get('/Video/DeleteAliyunVideo',params);
}
export function deleteVideo(params){
    return axios.get('/Video/DeleteVideo',params);
}
///////////////////////视频 END///////////////////

export function getBriefList(params){
    return axios.get('/Brief/GetBriefList',params);
}
export function getBriefBaseList(params){
    return axios.get('/Brief/GetBriefBaseList',params);
}
export function getBriefById(params){
    return axios.get('/Brief/GetBriefById',params);
}
export function addBrief(params){
    return axios.post('/Brief/AddBrief',params);
}
export function delBrief(params){
    return axios.post('/Brief/DelBrief',{},params);
}
//////////////////////内容管理 END/////////////////
export function login(params){
    return axios.post('/GlobalCode/login',params);
}