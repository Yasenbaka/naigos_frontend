<script setup lang="ts">
import blueArchiveAboutItem from "@/assets/Main/blue_archive_about_item.jpg";
import applyNaigosItem from "@/assets/Main/apply_naigos_item.jpg";
import naigosItem from "@/assets/Main/naigos_item.jpg";
import themeItem from "@/assets/Main/theme_toge_item.jpg";
import webManageItem from "@/assets/Main/web_manage_item.jpg";
import BlogItem from "@/assets/Main/blog_item.jpg";
import {useRouter} from "vue-router";
const router = useRouter();
import {useBAStStore} from "@/stores/BlueArchive/BAStStore";
const baStStore = useBAStStore();
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import {computed, ref, watch} from "vue";
import {PermiConst} from "@/constant/PermiConst";
import {hasPermission} from "@/utils/UserPermi/IsPermiUtil";

interface itemImpl {
  title: string;
  routerUrl: string;
  imgUrl?: any;
}
const itemList: itemImpl[] = [
  // {title: '奶果Naigos', routerUrl: '/naigos', imgUrl: naigosItem},
  {title: '博客文章', routerUrl: '/blog', imgUrl: BlogItem},
  {title: '主题包', routerUrl: '/theme', imgUrl: themeItem},
  {title: '蔚蓝档案相关', routerUrl: '/blue_archive', imgUrl: blueArchiveAboutItem},
  // {title: '加入奶果', routerUrl: '/apply', imgUrl: applyNaigosItem},
  {title: '网站管理', routerUrl: '/web_manage', imgUrl: webManageItem}
];

const itemClicked = (target: string) => {
  if (target === '/blue_archive') {
    baStStore.changeBAStShow(true);
    setTimeout(() => {
      baStStore.changeBAStShow(false);
      router.push(target);
    }, 1800)
  } else {
    router.push(target);
  }
}
const filteredItemList = computed(() => {
  return itemList.filter(
      item => !(item.title === '网站管理' && !hasPermission(userDetailStore.userPermi.permissions, PermiConst().MANAGER))
  );
});

</script>

<template>
  <div class="item_box">
    <div class="item"
         v-for="(item, index) in filteredItemList"
         :key="index"
         :title="item.title"
         @click="itemClicked(item.routerUrl)">
      <img :src="item?.imgUrl" alt="img"/>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes item_box_in
  0%
    opacity: 0
    transform: translateY(20px)
  100%
    opacity: 1
    transform: translateY(0)
@mixin item_box_in_ani()
  animation: item_box_in
  animation-duration: .8s
  animation-delay: .5s
  animation-fill-mode: forwards
.item_box
  width: 100%
  display: flex
  justify-content: space-between
  opacity: 0
  transform: translateY(20px)
  margin-bottom: 30px
  gap: 30px
  flex-wrap: wrap
  @include item_box_in_ani()
  .item:hover
    opacity: 1
    cursor: pointer
    box-shadow: white 0 0 10px
  .item
    width: 180px
    height: 90px
    background-color: #9cfafd
    border-radius: 10px
    overflow: hidden
    opacity: .8
    transition: opacity .5s ease, cursor .5s ease, box-shadow .3s ease
</style>