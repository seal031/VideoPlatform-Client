<template>
<div class="wrap">
  <div class="video-show-wrap rel wrapper-sticky">
    <top-tool-bar
    v-on:getSession="getSession"
    ></top-tool-bar>
    <div class="width1000">
      <el-breadcrumb separator=">" class="mt20 mb20">
        <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{breadcrumb}}</el-breadcrumb-item>
        <el-breadcrumb-item>视频详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="portal-divider"></el-divider>
      <el-row>
        <el-col :span="16">
          <div class="video_title">{{ videoForm.data.video_title }}</div>
          <div class="mb10">
            <span class="video_title redColor mr20">{{
              videoForm.data.award
            }} | {{videoForm.data.teacher}} </span>
            <span class="video_title redColor mr20"> {{SchoolForm.data.school_name}}  </span>
            <!-- <span>{{ dateFormat(videoForm.data.create_time) }}</span> -->
            <span>{{ videoForm.data.video_year }}</span>
          </div>
          <div class="videoBg pr20">
            <!-- <vue3VideoPlay
              id="player"
              v-bind="options"
              :src="videoForm.data.video_url"
            /> -->
          </div>
            <div id="aliyunVideoPlayer"></div>
          <el-row class="video_btns videoBg" align="middle">
            <span class="mr20 poi">
              <el-icon>
                <video-play />
              </el-icon>
              <span>{{ videoForm.data.view_count }}</span>
            </span>
            <span class="mr20 poi" @click="appreciateChange">
              <el-icon>
                <svg
                  t="1645883884232"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2963"
                  width="14"
                  height="14"
                >
                  <path
                    d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
                    p-id="2964"
                    fill="#303133"
                  />
                </svg>
              </el-icon>
              <span class="ml5">{{ videoForm.data.appreciate_count }}</span>
            </span>
            <!-- <span class="mr20 poi"> -->
            <!-- <el-icon>
                <svg
                  t="1646026485555"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5309"
                  width="14"
                  height="14"
                >
                  <path
                    d="M867.388103 458.139302c-16.591887-5.012154-33.967626 4.321422-38.959314 20.821211-9.688663 31.974225-22.997784 62.149479-39.538505 89.701998-57.707306 96.117105-158.449755 151.241586-276.41547 151.241586-117.996414 0-218.759329-55.144948-276.456403-151.282518-16.521279-27.552519-29.80891-57.707306-39.488363-89.620134-5.012154-16.490579-22.438035-25.824155-38.959314-20.821211-16.500812 5.012154-25.824155 22.448268-20.821211 38.959314 11.17348 36.814464 26.545586 71.676459 45.710065 103.619986C245.514693 705.835683 355.673605 771.657808 481.241462 781.072225l0 147.536194c0 17.252943 13.979386 31.232328 31.232328 31.232328s31.232328-13.979386 31.232328-31.232328L543.706119 781.072225c125.523855-9.41544 235.669464-75.217099 298.741965-180.26255 19.174712-31.934317 34.577516-66.836221 45.76123-103.712083C893.211235 480.58757 883.888915 463.151455 867.388103 458.139302z"
                    p-id="5310"
                    fill="#303133"
                  />
                  <path
                    d="M881.625362 221.404576c-9.445116-22.174022-31.242562-36.804231-55.836703-37.282115l-9.587356-0.091074c-55.643298 0-106.48729 16.714683-151.333684 35.329646C625.685225 152.107303 589.156264 107.241466 551.081087 79.404468c-2.134617-1.839905-4.443196-3.558036-6.944156-5.164626-17.304108-11.041474-38.928614-12.830213-57.767682-4.818749-5.438872 2.287089-10.502192 5.317099-15.077394 9.03784-37.892005 27.369348-75.661214 73.190953-115.027803 139.631154-44.348044-17.954931-94.358041-34.089399-147.96803-34.089399l-9.445116 0.101307c-24.288173 0.488117-46.076408 15.108093-55.521524 37.261649-21.60404 50.701752-30.449499 111.1331-25.600051 174.757163 1.25048 16.389272 14.935154 28.853142 31.110555 28.853142 0.793062 0 1.596358-0.030699 2.409886-0.091074 17.192567-1.311879 30.073946-16.317641 28.762067-33.520441-4.066619-53.375651 3.009544-103.427604 20.48659-144.816247l8.112772-0.080841c52.034097 0 101.95302 19.652596 148.618852 39.783075 14.700817 6.324032 31.842219 0.539282 39.651069-13.470803 40.168862-72.04178 76.688613-119.195729 111.662149-144.165424 0.731664-0.518816 1.026376-1.341554 1.707898-1.932002 0.945535 0.873903 1.952468 1.697665 2.99931 2.449795 34.740222 25.02086 71.00517 72.469522 110.848621 145.040351 7.807826 14.213723 25.193799 20.079314 40.026622 13.532201 44.998867-19.937075 97.56099-41.206494 151.770636-41.206494l8.559956 0.080841c16.490579 39.060621 23.77038 86.204337 21.055548 136.418996-0.935302 17.222243 12.271488 31.94455 29.493731 32.869618 17.090237 1.209548 31.94455-12.261255 32.869618-29.493731C911.129326 326.387605 902.050554 269.331121 881.625362 221.404576z"
                    p-id="5311"
                    fill="#303133"
                  />
                  <path
                    d="M390.593929 332.030116c-17.252943 0-31.232328 13.979386-31.232328 31.232328l0 30.469965c0 17.252943 13.979386 31.232328 31.232328 31.232328 17.252943 0 31.232328-13.979386 31.232328-31.232328l0-30.469965C421.827281 346.009502 407.846872 332.030116 390.593929 332.030116z"
                    p-id="5312"
                    fill="#303133"
                  />
                  <path
                    d="M634.363885 332.030116c-17.252943 0-31.232328 13.979386-31.232328 31.232328l0 30.469965c0 17.252943 13.979386 31.232328 31.232328 31.232328s31.232328-13.979386 31.232328-31.232328l0-30.469965C665.597237 346.009502 651.617851 332.030116 634.363885 332.030116z"
                    p-id="5313"
                    fill="#303133"
                  />
                  <path
                    d="M589.500095 473.470475c-14.304797-9.404184-33.591049-5.38873-43.157939 8.763594-0.132006 0.193405-13.613042 19.753903-34.170241 19.753903-19.98824 0-32.432667-18.117636-33.265638-19.378349-9.181103-14.416338-28.284183-18.808368-42.832528-9.750061-14.650675 9.099239-19.154245 28.354791-10.044774 43.005466 11.214413 18.046005 41.968857 48.587602 86.143962 48.587602 43.961234 0 75.102489-30.317493 86.570681-48.221258C607.962585 501.836523 603.774193 482.874659 589.500095 473.470475z"
                    p-id="5314"
                    fill="#303133"
                  />
                  <path
                    d="M855.131965 756.199745c-10.279111-13.878079-29.819143-16.805758-43.686988-6.557346L603.228771 903.486252c-13.867846 10.248412-16.805758 29.80891-6.557346 43.686988 6.130627 8.28571 15.575744 12.667507 25.142633 12.667507 6.456039 0 12.95301-1.982144 18.544355-6.110161l208.216205-153.844877C862.441441 789.638321 865.380376 770.077823 855.131965 756.199745z"
                    p-id="5315"
                    fill="#303133"
                  />
                  <path
                    d="M421.730067 903.486252 213.513862 749.642398c-13.888312-10.248412-33.428344-7.319709-43.686988 6.557346-10.248412 13.878079-7.309476 33.438577 6.557346 43.686988l208.216205 153.844877c5.591345 4.128017 12.088316 6.110161 18.544355 6.110161 9.56689 0 19.012006-4.381797 25.142633-12.667507C438.535825 933.296185 435.597913 913.734664 421.730067 903.486252z"
                    p-id="5316"
                    fill="#303133"
                  />
                </svg>
              </el-icon> -->
            <!-- TODO 鲜花 -->
            <!-- <span class="ml5">3456</span> -->
            <!-- </span> -->
            <!-- <span class="mr20 poi"> -->
            <!-- <el-icon>
                <svg
                  t="1646026532499"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5703"
                  width="14"
                  height="14"
                >
                  <path
                    d="M966.4 609.3v18l-0.3 0.6c-5.1 19.9-21 26.7-34.1 30.5-29 8.7-59.9 18-94.3 29.3-3.8 1.3-9.6 2.9-10.2 4.2-0.6 1-0.3 6.1 0 10.6v0.3c0 2.2 0.3 4.2 0.3 6.4v1.6c1.6 43.1-0.6 87.4-6.4 135.7-2.6 21.2-4.5 25.1-24.2 30.5-28.1 7.7-56.1 15.1-84.5 22.8-47.8 12.9-95.9 25.7-143.8 38.9-26.1 7.1-52.6 14.5-78.4 21.5l-35.4 9.6-0.6 0.3h-3.2l-1-0.3c-10.2-2.9-15.6-10.9-19.8-18l-3.2-5.5c-7-12.9-14.3-26.4-22.6-38.9-50.3-76.3-118.2-145.5-207.2-211.4-27.4-20.3-56.7-38.9-85.4-56.9-10.5-6.4-21-13.2-31.6-19.9-11.5-7.4-18.8-15.4-23.3-25.1l-0.6-1.3v-17l0.6-1.3c11.2-22.8 30.3-41.8 54.2-53.4 23.9-11.6 50.7-14.8 75.9-9.3 6.7 1.3 12.7 3.9 18.2 6.8 16.6 9.3 33.2 19.3 49.4 28.6 6.7 3.9 13.1 7.7 19.8 11.6 9.9 5.8 14.3 15.1 10.8 24.1-2.2 6.4-8.6 12.9-15 15.1-4.8 1.6-11.2 0.6-18.8-3.9-3.5-1.9-6.7-3.9-10.2-5.5-13.7-7.4-28.1-15.1-41.1-24.4-19.1-13.5-39.5-15.4-66.3-6.1-14.7 5.1-25.8 11.3-33.1 23.5 2.9 1.9 5.7 3.5 8.6 5.5 9.2 6.1 19.1 12.2 28.7 18C241.6 667.5 329.9 743.7 401 831.4c15.3 19 28.7 39.5 41.4 59.1 5.7 8.7 11.5 17.7 17.5 26.7 1.3 1.9 2.6 4.2 3.8 6.4l34.7-9.3c30.6-8.4 60.9-16.4 91.2-24.8l26.8-7.1c52-14.1 105.5-28.6 158.4-42.4 4.8-1.3 5.7-2.3 5.7-7.7 0.6-13.2 1.3-26.4 2.2-39.2 1.3-18 2.5-36.6 2.9-55 1.3-66.9-12.7-130.8-26.8-184.5-23.3-89-48.1-183.5-76.5-288.7-1.9-7.4-6.1-15.1-11.2-21.9-5.4-7.1-15.3-14.5-30-9.6-15.3 4.8-19.4 17.4-20.4 27-0.6 7.1 0.3 15.1 2.5 24.1 8.3 31.5 16.6 63.3 24.9 94.5 6.1 22.8 12.4 46.6 18.5 70.1 1 3.5 2.2 10.6 0.3 17-2.5 9-10.2 14.5-20.1 14.1-10.5-0.3-17.2-6.4-20.4-18.3l-12.1-45.3c-5.7-22.2-11.8-44-17.5-66.2-3.8-14.1-7.3-28.3-11.2-42.1-10.2-38.3-20.7-78.1-31.2-117-1.9-7.4-6.1-15.1-11.2-21.9-7.7-9.6-18.2-13.5-29.6-10.3-14.3 3.9-18.5 16.7-20.1 23.8-1.3 7.7-1.3 16.4 0.6 23.5 18.2 70.1 37.3 141.1 55.5 209.9 5.1 19.6 10.2 38.9 15.6 58.5 0 0.6 0.3 1 0.3 1.6 0.3 1.6 1 3.2 1.3 5.1 1.9 13.5-3.8 23.1-15.6 26-11.2 2.6-21.4-3.5-24.9-16.1-3.5-11.6-6.7-23.1-9.6-34.7l-1.9-7.1c-10.8-40.8-21.7-81.3-32.5-122.2-13.4-50.8-26.8-101.6-40.2-152.1-5.1-19.3-17.5-30.9-35.4-32.1-16.3-1.3-32.5 8.7-38.9 23.8-3.5 8.4-3.8 17-0.6 28.9 10.8 40.8 21.7 82 32.5 122.8 8 29.9 15.9 59.5 23.6 89.4 3.5 13.2 7 26 10.5 39.2 5.4 20.6 10.8 40.8 16.3 61.4 2.5 9.6 1.3 18.3-3.8 24.1-4.1 5.1-10.5 7.4-17.9 6.8-14.3-1.6-17.9-14.5-19.1-19.3L398 477.1 384.7 427l-13.1-53.4c-13.4-50.8-27.4-103.5-41.4-155.3-5.4-19.6-16.3-30.2-32.5-30.9-19.1-1-34.1 8.4-41.1 25.4-3.2 7.7-3.2 16.4-0.3 28L334.6 536l14.7 55c1 2.9 1.6 6.1 2.2 9.3 2.5 13.2-3.2 23.5-14.7 26.7-11.5 3.2-22.3-3.9-25.8-16.4-3.5-12.2-6.7-24.8-9.9-36.6-1.3-4.2-2.2-8.7-3.5-12.9l-11.5-43.4c-5.4-20.6-10.8-40.8-16.3-61.4-4.5 9.6-8.3 18.6-12.4 28-1 1.9-1.6 4.2-2.2 6.4l-1.9 5.8c-4.8 12.5-15.6 18.3-26.8 14.1-11.5-4.2-16.6-15.1-12.8-27.6 8-27.6 20.4-53.4 37.3-76.8 3.2-4.5 3.8-7.7 2.2-13.2-11.2-40.8-22.6-84.2-37.6-140.5-10.8-41.1 3.2-76.5 38.6-96.8 21-11.9 44.6-14.1 68.5-5.5 1.9 0.6 3.8 1.3 5.4 2.3 12.8-30.5 36-48.2 68.2-51.8 31.9-3.5 57.4 8.7 75.9 36 4.1-3.9 8.3-7.7 13.1-10.6 15.3-10 34.7-13.2 53.2-8.7 18.8 4.5 34.4 16.1 44 32.8 6.7 11.6 10.5 24.4 14.7 36.6 1.6 5.1 3.2 10.3 5.1 15.1 0.6 1.6 1.3 3.5 1.6 5.1 1.3-0.6 2.6-1.6 3.8-2.3 8-4.8 16.6-10 25.8-12.5 35.4-10 73 10.9 86.1 47.9 7 20.3 12.4 41.1 17.9 61.4 1.3 4.5 2.2 9 3.5 13.5l9.2 34.7c18.2 69.1 37.3 140.5 55.1 210.9 5.4 21.2 9.6 43.1 13.7 64.3 1.6 7.7 3.2 15.4 4.8 23.5l100.4-30.9c-2.5-10.6-9.2-19.6-21-28-16.6-11.6-34.7-22.2-57.4-19-5.1 0.6-9.9-0.6-14-3.9-4.5-3.2-7.3-8-8-13.5-1.6-12.2 4.1-21.9 14.7-23.5 9.6-1.6 22-3.2 33.5-0.6 39.2 8.7 68.5 28.9 87 60.4 2.5 4.2 4.1 9 6.1 13.2 0.6 1.9 1.6 3.9 2.2 5.5l-0.9 1.2z m0 0"
                    fill="#303133"
                    p-id="5704"
                  />
                  <path
                    d="M899.8 264c-19.8 37-41.1 73.6-61.8 109.3l-22 37.6c-4.5 7.7-11.2 11.9-18.5 11.9-3.5 0-7-1-10.8-2.9-5.1-2.9-8.6-7.1-9.9-12.2-1.6-5.8-0.3-12.5 3.5-19 10.5-18.6 21-37 31.9-55.6 14.3-24.8 29-50.5 43.4-75.9 4.5-7.7 8.9-15.8 11.2-24.1 5.1-17.7-4.1-36.3-21.7-44.4-19.1-9-34.7-4.5-46.5 12.9-5.1 7.4-9.9 14.8-15 22.2L772 241.2c-5.7 8.7-15.3 11.6-23.6 7.7-6.4-2.9-12.1-9-13.7-15.1-1.9-6.8 1.9-14.5 4.1-18.6 3.8-6.8 8.3-13.2 12.1-19.6 5.1-8 10.5-16.1 15-24.4 9.6-17 8-33.8-5.1-46.9-8.6-9-20.4-13.5-31.9-12.2-11.5 1.3-21.4 7.4-28 17.7-4.1 6.4-8 13.2-11.8 19.9-3.2 5.8-6.7 11.9-10.5 18-2.6 4.2-7.7 10.9-14.7 12.2-6.4 1.3-16.3-0.6-20.4-6.1-5.4-6.8-4.5-17.7-3.8-20.9 0.6-4.5 1.9-9 3.2-13.2 1.3-5.1 2.9-9.6 2.9-14.1 0.3-7.1-1.3-19.6-14.7-26-10.5-4.8-21.4-3.5-32.5 4.8-1.3 1-2.5 1.9-3.8 3.2-1.3 1.3-2.9 2.6-4.1 3.5-8.9 6.7-20.7 6.1-28-1.6-8-8.4-8-20.6-0.3-29.3 17.2-19.3 43.4-28.9 67.9-25.1 21.4 3.2 39.2 15.8 49.1 35.4 25.5-21.9 53.2-26.7 83.2-14.8 30 11.9 47.8 35 52 66.9h5.7c8 0 16.3 0.3 24.2 1.9 26.8 6.1 48.1 23.1 58.6 46.6 11 22.4 9.4 49.1-3.3 72.9zM177.5 364.9c-18.2 7.1-34.7 12.5-51 17-1.6 0.6-3.5 0.6-5.1 0.6-7.6 0-14.7-5.1-17.5-13.5-4.1-10.9-0.6-21.2 8.3-25.1 12.7-5.5 25.5-10 37.9-14.1 4.5-1.6 8.9-3.2 13.1-4.8l1.3-0.3h1.3c4.8 0.3 18.8 1.9 22.3 16.1 2.7 11-1.7 20.6-10.6 24.1z m13.7-197.3l-2.2 2.9c-0.6 1-1.6 2.3-2.5 3.5-2.6 3.9-5.1 8-9.9 10-2.2 1-5.1 1.3-8.3 1.3-4.8 0-9.9-1.3-13.4-4.2-12.4-10.6-23.6-22.5-32.8-32.8-7.6-8.4-7-20.3 1-28.6 8-7.7 20.7-8 28.4-0.6 11.5 10.6 22.3 22.2 32.2 32.8 2.2 2.3 3.2 5.1 4.1 8 0.3 1.3 1 2.6 1.6 3.9l1.8 3.8z m91.4-61.4l-2.9 3.2-3.8 4.8c-2.9 3.9-5.7 7.7-10.2 10-2.9 1.6-6.1 2.6-9.2 2.6-6.4 0-12.4-3.2-15.9-9.3-6.4-11.3-12.1-23.1-17.2-35.4-3.8-9.3-0.6-18.6 8.3-24.4 9.6-6.1 20.1-4.8 25.2 2.6 6.1 9.3 11.5 19 16.9 29.3 2.2 4.2 4.5 8.4 7 12.9l1.8 3.7zM168.8 269.8c-3.5 4.2-8.3 6.4-13.4 6.7-6.1 0.3-11.8 0.6-17.8 0.6-5.7 0-11.5-0.3-16.9-0.6-10.8-0.6-18.8-10-18.5-21.5 0.3-11.3 8.3-19.3 19.4-20.3 4.1-0.3 8.3-0.3 12.1 0h20.4c10.8 1 18.8 8.7 19.8 19.9 0.4 5.5-1.5 11-5.1 15.2z m0 0"
                    fill="#303133"
                    p-id="5705"
                  />
                </svg>
              </el-icon> -->
            <!-- TODO 掌声 -->
            <!-- <span class="ml5">3456</span> -->
            <!-- </span> -->
            <el-button
              class="mr20"
              type="text"
              v-if="isStar"
              :icon="Star"
              @click="starChange"
              v-preventReClick
              >收藏</el-button
            >
            <el-button
              class="mr20"
              type="text"
              v-if="!isStar"
              :icon="StarFilled"
              @click="starChange"
              v-preventReClick
              >已收藏</el-button
            >
            <!-- <el-button class="mr20" type="text" :icon="Share">转发</el-button> -->
          </el-row>
        </el-col>
        <el-col :span="8" class="rel">
          <el-card shadow="never">
            <template #header>
              <el-row justify="space-between" align="middle">
                <span class="f20">相关视频</span>
                <!-- TODO 点击跳转 -->
                <el-button type="text" class="more-btn">更多 ></el-button>
              </el-row>
            </template>

            <div v-if="relativeVideoList && relativeVideoList.length > 0">
              <el-row
                style="flex-wrap: nowrap"
                class="poi"
                v-for="(ele, i) in relativeVideoList.slice(0, 8)"
                :key="i"
                @click.enter="rlVideoClick(ele.video_id)"
              >
                <video-item
                  class="video-item mr10"
                  :src="ele.video_facede"
                  :tip="ele.video_title"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                  :isShowCount="false"
                />
                <div class="f12 des" v-tooltip-auto-show>
                  <el-tooltip
                    :content="ele.video_title"
                    placement="top-start"
                  >
                    <div class="truncate-text">{{ ele.video_title }}</div>
                  </el-tooltip>
                  <div class="redColor sub-title">
                    <span class="mr5 truncate-text">{{ele.award}}</span>
                  </div>
                  <div class=" sub-title">
                    <span class="author">{{ ele.teacher }}</span>
                  </div>
                  <div class=" sub-title">
                    <span class="mr5">{{ ele.video_year }}</span>
                  </div>
                  <el-divider
                    class="portal-divider"
                    style="margin: 8px 0"
                  ></el-divider>
                  <div>
                    <el-icon><video-play /></el-icon>
                    <!-- TODO 播放量 -->
                    <span class="mr10">{{ ele.view_count }}</span>
                    <el-icon>
                      <svg
                        t="1645883884232"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2963"
                        width="14"
                        height="14"
                      >
                        <path
                          d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
                          p-id="2964"
                          fill="#303133"
                        ></path>
                      </svg>
                    </el-icon>
                    <!-- TODO 点赞量-->
                    <span>{{ ele.appreciate_count }}</span>
                  </div>
                </div>
              </el-row>
            </div>
            <div v-else-if="relativeVideoList">视频资源正在审核中……</div>
            <div v-else>视频列表加载中...</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="article-wrap">
      <div class="width1000">
        <el-col :span="17" class="pr20 article">
          <div :class="articleStyle">
            {{ videoForm.data.video_brief }}
          </div>
          <el-button type="text" class="more-btn" @click="showOrHide">{{
            articleShowOrHideText
          }}</el-button>
        </el-col>
      </div>
    </div>
    <portal-footer></portal-footer>
  </div>
</div>
</template>

<script>
import moment from "moment";
import "vue3-video-play/dist/style.css";
import { Star, StarFilled, Share } from "@element-plus/icons-vue";
import vue3VideoPlay from "vue3-video-play";
import {
  ref,
  reactive,
  onMounted,
  onBeforeUpdate,
  onActivated,
  computed,
} from "vue";
import TopToolBar from "../components/TopToolBar.vue";
import VideoItem from "../components/VideoItem.vue";
import PortalFooter from "../components/PortalFooter.vue";
import {
  getVideoById,
  getRelativeVideoList,
  addCollection,
  cancelCollection,
  addViewHistory,
  addAppreciate,
  cancelAppreciate,
  getCollectionAppreciateState,
  getVideoPlayAuth,
  getSchoolById,
} from "../api/serviceApi";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { VideoPlay } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default {
  components: {
    TopToolBar,
    vue3VideoPlay,
    VideoPlay,
    VideoItem,
    PortalFooter,
  },
  setup() {
    const router = useRouter();
    const route = useRoute(); //可以在setup中使用route获取参数

    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let breadcrumb=ref("");//面包屑

    let videoId = "";
    let isStar = ref(false); //是否已收藏
    let isAppreciate = ref(false); //是否点赞
    let isStarText = ref("收藏");
    let relativeVideoList = ref([]); //相关视频模型列表
    let options = reactive({
      width: "100%", //播放器宽度
      height: "550px", //播放器高度
      color: "#409eff", //主题色
      title: "", //视频名称
      src: "", //视频源https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4
      muted: false, //静音
      webFullScreen: false,
      speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
      autoPlay: false, //自动播放
      loop: false, //循环播放
      mirror: false, //镜像画面
      ligthOff: false, //关灯模式
      volume: 0.3, //默认音量大小
      control: true, //是否显示控制
      controlBtns: [
        "audioTrack",
        "quality",
        "speedRate",
        "volume",
        "setting",
        "pip",
        "pageFullScreen",
        "fullScreen",
      ], //显示所有按钮,
    });
    const videoForm = reactive({
      data: {
        video_id: "",
        video_title: "",
        video_brief: "",
        video_type: "",
        video_year: "",
        teacher: "",
        award: "",
        public_type: "",
        public_school: "",
        video_school: "",
        video_state: "",
        video_url: "",
        video_facede: "",
        create_time: null,
        edit_time: null,
        view_count: 0,
        collection_count: 0,
        appreciate_count: 0,
        video_facede: "",
        aliyun_videoId:"",
      },
    });
    //学校数据模型
    let SchoolForm = reactive({
      data: {
        school_id: null,
        school_name: "",
        school_type_code: "",
        school_category_code: "",
        administrator: "",
        operate_admin: null,
      },
    });
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    const getParams = () => {
      videoId = route.query.videoId;
    };
    const bindVideo = () => {
      if (videoId != "") {
        let query = {
          params: {
            orderBy: "hot",
            video_id: videoId, //后台参数是string，不加reactive
          },
        };
        getVideoById(query).then((res) => {
          if (res.resultCode == "200") {
            videoForm.data = JSON.parse(res.data);
            //绑定面包屑
            switch (videoForm.data.video_type) {
              case "0201":
                breadcrumb.value = "青教赛";
                // breadcrumbParam.value="tpxw";
                break;
              case "0202":
                breadcrumb.value = "青管赛";
                // breadcrumbParam.value="tzgg";
                break;
              case "0203":
                breadcrumb.value = "师德榜样";
                // breadcrumbParam.value="zcfg";
                break;
              case "0204":
                breadcrumb.value = "云课堂";
                // breadcrumbParam.value="zcfg";
                break;
            }
            
            document.title = videoForm.data.video_title;

            let params = {
              params: {
                school_id: videoForm.data.video_school,
              },
            };
            getSchoolById(params).then((res)=>{
              if (res.resultCode == "200") {
                SchoolForm.data = JSON.parse(res.data);
              }
            });
            if(videoForm.data.aliyun_videoId!=null){
              getAliyunVideoAuth();
            }
            else{
              playVideo();
            }
          }
        });
      }
    };
    const dateFormat=(date) =>{
        return moment(date).format("YYYY-MM-DD");
      };
    const getCollectionAppreciate=()=>{
      if(videoId!=""){
        let query={
          params:{
            video_id:videoId,
            user_id:userId,
          },
        };
        getCollectionAppreciateState(query).then((res)=>{
          if(res.resultCode=="200"){
            // debugger
            isStar.value=!res.data.Collection
            isAppreciate.value=!res.data.Appreciate
          }

        })
      }
    }
    const getRLVideoList = () => {
      if (videoId != "") {
        let query = reactive({
          params: {
            videoId: videoId, //后台参数是类，加reactive
            topN: 7,
          },
        });
        getRelativeVideoList(query).then((res) => {
          if (res.resultCode == "200") {
            debugger
            relativeVideoList.value = JSON.parse(res.data.videoList);
            console.log(relativeVideoList);
          }
        });
      }
    };
    const rlVideoClick = (videoId) => {
      //跳转相关视频
      console.log(videoId);
      // 页面跳转
      const href = router.push({
        path: "/VideoShow",
        query: { videoId: videoId },
      });
    };
    let isShowAll = ref(false); // 是否展开文章，默认是false
    const showOrHide = () => {
      isShowAll.value = !isShowAll.value;
      console.log(isShowAll.value);
    };
    const articleStyle = computed(() => {
      return isShowAll.value ? "" : "hideArt";
    });
    const articleShowOrHideText = computed(() => {
      return isShowAll.value ? "收起" : "展开";
    });
    const addView = () => {
      //观看量
      let params = {
        params: {
          user_id: userId,
          video_id: videoId,
        },
      };
      addViewHistory(params).then((res) => {
        if (res.resultCode == "200") {
        }
      });
    };
    const appreciateChange = () => {
      //点赞
      let params = {
        params: {
          user_id: userId,
          video_id: videoId,
        },
      };
      if (isAppreciate.value == true) {
        //如果当前是true，则赞
        addAppreciate(params).then((res) => {
          if (res.resultCode == "200") {
            isAppreciate.value = !isAppreciate.value;
            ElMessage.success("点赞成功");
            videoForm.data.appreciate_count+=1;
          }
        });
      } else {
        //如果当前是false，则取消赞
        cancelAppreciate(params).then((res) => {
          if (res.resultCode == "200") {
            isAppreciate.value = !isAppreciate.value;
            ElMessage.success("已取消点赞");
            videoForm.data.appreciate_count-=1;
          }
        });
      }
    };
    const starChange = () => {
      if ((userId == null) || (userId == "null"||userId==""||userId==undefined)) {
        ElMessage.warning("您还未登陆，无法收藏");
        return;
      }
      let params = {
        params: {
          user_id: userId,
          video_id: videoId,
        },
      };
      if (isStar.value == true) {
        //如果当前是true，则收藏
        addCollection(params).then((res) => {
          if (res.resultCode == "200") {
            isStar.value = !isStar.value;
            ElMessage.success("收藏成功");
          }
        });
      } else {
        //如果当前是false，则取消收藏
        cancelCollection(params).then((res) => {
          if (res.resultCode == "200") {
            isStar.value = !isStar.value;
            ElMessage.success("已取消收藏");
          }
        });
      }
    };
    /////////阿里云视频相关///////
    var aliyunPlayAuth="";//阿里云播放授权

    const getAliyunVideoAuth=()=>{
      debugger
      let query = {
          params: {
            accessKeyId: "c9FjqwmD4XLC5H2M",
            accessKeySecret:"V5NBQA3zN9dP78b9XLai3APQ5EFM3V",
            videoId:videoForm.data.aliyun_videoId,
          },
        };
        getVideoPlayAuth(query).then((res)=>{
          if(res.resultCode=="200"&&res.data.ErrorMessage==""){
            aliyunPlayAuth=res.data.PlayAuth;
            // aliyunVideoId=res.data.VideoId;
            // CoverUrl=res.data.CoverUrl;
            playVideo();
          }
          else{
            ElMessage({
              message: "获取视频播放信息失败."+res.data.ErrorMessage,
              grouping: true,
              type: "error",
            });
          }
        });
    }
    const playVideo=()=>{
      if(videoForm.data.aliyun_videoId!=null)
      {
        var player = new Aliplayer({
           id: 'aliyunVideoPlayer',
           width: '100%',
           height: '500px',
           vid : videoForm.data.aliyun_videoId,
           playauth : aliyunPlayAuth,
         },function(player){
        });
      }
      else{
        var player = new Aliplayer({
           id: 'aliyunVideoPlayer',
           width: '100%',
           height: '580px',
           source:videoForm.data.video_url
         },function(player){
        });
      }
    }

    /////////阿里云视频相关end/////
    onMounted(() => {
      getSession();
      getParams();
      bindVideo();
      getCollectionAppreciate();
      getRLVideoList();
      addView();
    });
    onBeforeUpdate(() => {
      getParams();
      bindVideo();
      getRLVideoList();
    });
    return {
      moment,
      Star,
      StarFilled,
      Share,

      userId,
      userRole,
      userName,
      realName,
      userSchool,
      breadcrumb,

      videoId,
      isStar,
      isAppreciate,
      isStarText,
      videoForm,
      SchoolForm,
      options,

      getSession,
      getParams,
      bindVideo,
      dateFormat,
      getCollectionAppreciate,
      getRLVideoList,
      relativeVideoList,
      rlVideoClick,
      showOrHide,
      articleStyle,
      articleShowOrHideText,
      addView,
      starChange,
      appreciateChange,

      aliyunPlayAuth,
      getAliyunVideoAuth,
      playVideo,
    };
  },
};
</script>

<style>
.wrap{
  height: 100%;
  overflow: auto;
}
.width1000 {
  width: 1000px;
  margin: 0 auto;
}
.video_title {
  font-size: 22px;
  margin-bottom: 4px;
}
.redColor {
  color: #de460c;
}
.videoBg {
  background-color: #faf8f9;
}
.video_btns {
  height: 48px;
  padding: 0 20px;
  color: var(--el-text-color-primary);
}
.video_btns .el-button {
  color: var(--el-text-color-primary);
}
.video-show-wrap .el-card {
  position: absolute;
  width: 100%;
  --el-card-border-color: transparent;
  --el-card-padding: 0;
  max-height: 973px;
  display: flex;
  flex-direction: column;
}
.video-show-wrap .more-btn {
  color: #5f6061;
}
.video-show-wrap .el-card .el-card__header{
  margin-left: 20px;
}
.video-show-wrap .el-card__body {
  background-color: #faf8f9;
  margin-top: 42px;
  padding-top: 10px;
  overflow: auto;
  padding: 20px 20px 0;
}

.sub-title{
  display: flex;
}

.sub-title .author{
  white-space: nowrap;
}

.video-show-wrap .video-item {
  /* 视频比是16:9 */
  width: 176px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.video-show-wrap .des {
  flex: 1 1 0%;
  width: 0;
}
.article-wrap {
  min-height: 230px;
  background-color: #cfeee9;
  padding: 60px 0;
}
.article {
  line-height: 1.5;
}
.hideArt {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.time {
  font-size: 13px;
  color: #999;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>