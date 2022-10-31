<template>
<remote-js></remote-js>
</template>

<script>
import { h } from 'vue'
// 外网IP
export default {
    name: 'OuterIp',
    components: {
        'remote-js': {
            render() {
                return h('script', {
                    type: 'text/javascript', 
                    src: 'http://pv.sohu.com/cityjson?ie=utf-8&timestamp='+new Date().getTime()+'' 
                })
            }
        }
    }
}
</script>

<style>
</style>