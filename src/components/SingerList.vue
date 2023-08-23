<template>
  <div class="singer">
    <div class="singerItem">
        <template v-for="item in props.singerList" :key="item.id">
            <SingerItem :item="item"></SingerItem>
        </template>         
    </div>
  </div>
</template>

<script setup>
import {} from "vue"
import SingerItem from "./SingerItem.vue";
const props = defineProps(['singerList'])
</script>

<style lang="scss" scoped>
.singer{
    margin: 20px;
    .singerItem{
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
