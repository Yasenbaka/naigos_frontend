<script setup lang="ts">
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interfaces/UserArchiveImpl";
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
import {httpSpring} from "@/utils/http";
import {showMessageNotice} from "@/utils/MsgNotific";
const userDetailStore = useUserDetailStore();
import {useRouter} from "vue-router";
const router = useRouter();

const userArchive = ref<UserArchiveImpl>({
  id: userDetailStore.userDetails.id,
  qq_id: userDetailStore.userDetails.qq_id,
  nickname: userDetailStore.userDetails.nickname,
  group_real_user_id: userDetailStore.userDetails.group_real_user_id,
  register_real_group_id: userDetailStore.userDetails.register_real_group_id,
  city: userDetailStore.userDetails.city,
  score: userDetailStore.userDetails.score,
  avatar: userDetailStore.userDetails.avatar,
  favorite: userDetailStore.userDetails.favorite,
  email: userDetailStore.userDetails.email,
  safe_level: userDetailStore.userDetails.safe_level,
})

const editClicked = () => {
  console.log(userArchive.value);
  httpSpring({
    url: 'users/edit_archive/web',
    method: 'PUT',
    headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
    data: userArchive.value,
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('teal', res?.data?.data);
      userDetailStore.fetchUserArchive();
      router.back();
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {
    showMessageNotice('red', '请求异常！请检查网络！');
  })
}
const exitEditClicked = () => {
  router.back();
}
const editRouterClicked = (routerName: string) => {
  router.replace({name: routerName});
}

watch(() => userDetailStore.userDetails, (newVal: UserArchiveImpl) => {
  userArchive.value = {...newVal};
})
</script>

<template>
  <div class="edit_archive_box">
    <el-form label-width="auto" :model="userArchive" style="width: 800px;" @submit.prevent="editClicked">
      <el-form-item label="昵称：">
        <el-input type="text" v-model="userArchive.nickname"/>
      </el-form-item>
      <el-form-item label="电子邮箱：">
        <el-input type="text" v-model="userArchive.email"/>
      </el-form-item>
      <el-form-item label="QQ号：">
        <el-input title="一年只能修改一次" type="text" v-model="userArchive.qq_id"/>
        一年只能修改一次！
      </el-form-item>
      <el-form-item label="所在地：">
        <el-input type="text" v-model="userArchive.city"/>
        任意国、省、市、区县镇或外国、州、府、道、区，也可精确全写。
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">确认修改</el-button>
        <el-button type="warning" native-type="button" @click="exitEditClicked">取消修改</el-button>
        <el-button type="success" native-type="button" @click="editRouterClicked('PersonalCenterEditAvatar')">修改头像</el-button>
        <el-button type="success" native-type="button" @click="editRouterClicked('PersonalCenterEditPassword')">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="sass">
.edit_archive_box
  color: #666
</style>