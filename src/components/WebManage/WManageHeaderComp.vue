<script setup lang="ts">
import defaultAvatar from "@/assets/Main/avatar.jpg";
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import type {UserPermiImpl} from "@/interfaces/UserPermiImpl";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";

const userPermi = ref<UserPermiImpl>(userDetailStore.userPermi);
const userArchive = ref<UserArchiveImpl>(userDetailStore.userDetails);

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
watch(() => userDetailStore.userPermi, (newVal: UserPermiImpl) => {
  userPermi.value = newVal;
})
</script>

<template>
  <header>
    <img class="avatar" :src="userArchive?.avatar || defaultAvatar" alt="avatar">
    <p class="header_title">{{`网站${userPermi.cn}：${userArchive.nickname}`}}</p>
  </header>
</template>

<style scoped lang="sass">
header
  width: 100%
  height: 60px
  background-color: #57505d
  display: flex
  align-items: center
  .avatar
    height: 80%
    border-radius: 50%
    margin-left: 2%
  .header_title
    margin-left: 1%
    font-size: 18px
    color: white
    font-family: BAFJ_CU, sans-serif
</style>