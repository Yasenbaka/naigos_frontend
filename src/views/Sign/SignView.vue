<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();
import {useUserDetailStore} from "@/stores/User/UserDetailStore";
const userDetailStore = useUserDetailStore();
import SignBgComp from "@/components/Sign/SignBgComp.vue";
import {computed, onMounted, ref, h} from "vue";
import { ElMessage } from 'element-plus'
import {httpSpring} from "@/utils/http";

interface LoginFormImpl {
  account: string | null;
  password?: string | null;
  code?: string | null;
  login_type: string;
  account_type: string;
}
interface RegisterFormImpl {
  nickname: string | null;
  email: string | null;
  qq_id: string | null;
  password: string | null;
  re_password: string | null;
  city: string | null;
}

const registerForm = ref<RegisterFormImpl>({
  nickname: null,
  email: null,
  qq_id: null,
  password: null,
  re_password: null,
  city: null,
})
const loginForm = ref<LoginFormImpl>({
  account: null,
  password: null,
  code: null,
  login_type: 'normal',
  account_type: 'uid',
})
const signBoxStatus = ref<number>(0);
const signInUpBoxPosition = ref<string>('left');

const changeAccountType = () => {
  if (loginForm.value.account_type === 'uid') {
    loginForm.value.account_type = 'email';
  } else {
    loginForm.value.account_type = 'uid';
  }
}
const changeLoginType = () => {
  if (loginForm.value.login_type === 'normal') {
    loginForm.value.login_type = 'nopwd';
  } else {
    loginForm.value.login_type = 'normal';
  }
}
const signBoxStatusClicked = (target: number) => {
  signBoxStatus.value = target;
  switch (target) {
    case 0: signInUpBoxPosition.value = 'left'; break;
    case 1: signInUpBoxPosition.value = 'right'; break;
    default: break;
  }
}
const signInUpBoxStyle = computed(() => {
  const position = signInUpBoxPosition.value === 'left'?
      {left: '0', transform: 'translateY(-50%) translateX(0)'}:
      {left: 'calc(100% - 25%)', transform: 'translateY(-50%) translateX(-50%)'};
  return {...position};
})
const titleLogoStyle = computed(() => {
  const position = signInUpBoxPosition.value === 'left'?
      {transform: 'translateX(-80%)'}:
      {transform: 'translateX(-210%)'};
  return {...position};
})

const loginButtonClicked = () => {
  console.log(loginForm.value);
  switch (loginForm.value.login_type) {
    case 'normal': {
      httpSpring({
        url: 'users/sign/in',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: loginForm.value,
      }).then(res => {
        if (res?.status === 200 && res?.data?.code === 0){
          window.localStorage.setItem('token', res.data.data);
          userDetailStore.fetchUserArchive();
          userDetailStore.fetchUserAvatar();
          router.back();
        } else {
          ElMessage({
            message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
              h('span', { style: 'color: teal' }, res?.data?.message)
            ]),
          })
        }
      }).catch(err => {
        console.error(err);
      }); break;
    } case 'nopwd': {
      httpSpring({
        url: 'users/sign/nopwdcl',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: loginForm.value
      }).then(res => {
        if (res?.data?.code === 0) {
          window.localStorage.setItem('token', res.data.data);
          userDetailStore.fetchUserArchive();
          userDetailStore.fetchUserAvatar();
          router.back();
        } else {
          ElMessage({
            message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
              h('span', { style: 'color: teal' }, res?.data?.message)
            ]),
          })
        }
      }).catch(err => {
        console.error(err);
      })
    }
  }
}
const requestCodeClicked = () => {
  if (!loginForm.value.account) return;
  console.log(loginForm.value);
  httpSpring({
    url: 'users/sign/in',
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: loginForm.value,
  }).then(res => {
    if (res?.data?.code === 0){
      loginForm.value.code = res?.data?.data;
    } else {
      alert(res?.data?.message);
    }
  }).catch(err => {
    console.error(err);
  })
}
const registerButtonClicked = () => {
  if (registerForm.value.password !== registerForm.value.re_password){
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', { style: 'color: teal' }, '两次密码不匹配')
      ]),
    })
    return;
  }
  httpSpring({
    url: 'users/sign/up',
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: registerForm.value,
  }).then(res => {
    if (res?.data?.code === 0){
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
          h('span', { style: 'color: teal' }, res?.data?.data?.message)
        ]),
      })
      window.localStorage.setItem('token', res.data.data.token);
      router.back();
    } else {
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
          h('span', { style: 'color: red' }, res?.data?.message)
        ]),
      })
    }
  }).catch(() => {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', { style: 'color: teal' }, '注册失败！')
      ]),
    })
  })

}
onMounted(() => {
  if (window.localStorage.getItem('token')) router.back();
})
</script>

<template>
  <div class="container">
    <SignBgComp/>
    <div class="sign_form_box">
      <img class="title_logo" src="@/assets/Sign/login_register.png" alt="title" :style="titleLogoStyle"/>
      <div class="sign_bg">
        <img class="midori" src="@/assets/Sign/midori.png" alt="midori"/>
        <img class="momoi" src="@/assets/Sign/momoi.png" alt="momoi"/>
        <div class="left_box">
          <h4>欢迎您选择加入奶果Naigos！</h4>
          <hr/>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;奶果：名源于站长Yasenbaka曾经开发的QQ群Bot！</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bot申请腾讯官方机器人App后还在重新开发阶段！</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在本站中，您可以执行基础的奶果Bot功能，同时，本站收录了站长Yasenbaka的全部成果。</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未来本站会将互联网上优秀的同好、二创作品获取授权并收录。</p>
        </div>
        <div class="right_box">
          <h4>欢迎登录奶果Naigos！</h4>
          <hr/>
          <div v-if="loginForm.login_type === 'normal'">
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您可以选择使用档案UID或邮箱登录！</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若您在QQ群中Bot被记住了，且初次使用本站，请使用无密码登录！</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若您忘记密码，点击按钮后密码将会清空，届时您需要使用无密码登录后在个人中心设置密码！</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若您曾经使用过旧奶果而不是腾讯认证奶果Bot，登录后可以将旧档案迁移并获得补偿！</p>
          </div>
          <div v-if="loginForm.login_type === 'nopwd'">
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用无密码登录请阅读以下步骤~：</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、选择UID或电子邮箱登录方式，填写后点击获取验证码，验证码框将出现六位验证码。</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、记住验证码后在任意拥有腾讯认证奶果Bot的群聊中输入：@奶果酱 /登录验证码 六位验证码</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、奶果回复您成功后，在网页中点击登录档案即可！</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e、奶果酱常驻群：829952346</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e、若您在群无奶果酱可加此群↑</p>
          </div>
        </div>
        <div class="sign_in_up_box" :style="signInUpBoxStyle">
          <div v-if="loginForm.login_type === 'normal' && signBoxStatus === 0">
            <h3>登录奶果档案</h3>
            <hr/>
            <el-form label-width="auto" class="signin_form" :model="loginForm" @submit.prevent="loginButtonClicked">
              <el-form-item label="账号：" v-if="loginForm.account_type === 'uid'">
                <el-input type="text" required v-model="loginForm.account"/>
              </el-form-item>
              <el-form-item label="电子邮箱：" v-if="loginForm.account_type === 'email'">
                <el-input type="text" required v-model="loginForm.account"/>
              </el-form-item>
              <el-form-item label="密码：">
                <el-input type="password" required v-model="loginForm.password"/>
              </el-form-item>
              <div class="buttons">
                <el-button type="primary" native-type="submit">登录档案</el-button>
                <el-button native-type="button" @click="changeAccountType">{{ loginForm.account_type === 'uid' ? '邮箱登录' : 'UID登录' }}</el-button>
                <el-button type="danger" native-type="button">忘记密码</el-button>
                <el-button type="warning" @click="signBoxStatusClicked(1)" native-type="button">注册档案</el-button>
              </div>
            </el-form>
          </div>
          <div v-if="loginForm.login_type === 'nopwd' && signBoxStatus === 0">
            <h3>无密码登录奶果档案</h3>
            <hr/>
            <el-form label-width="auto" class="nopwd_signin_form" :model="loginForm" @submit.prevent="loginButtonClicked">
              <el-form-item label="账号：" v-if="loginForm.account_type === 'uid'">
                <el-input type="text" required v-model="loginForm.account"/>
              </el-form-item>
              <el-form-item label="电子邮箱：" v-if="loginForm.account_type === 'email'">
                <el-input type="text" required v-model="loginForm.account"/>
              </el-form-item>
              <el-form-item>
                <button type="button" @click="requestCodeClicked" class="recode_button">获取验证码</button>
              </el-form-item>
              <el-form-item label="验证码：">
                <el-input type="text" v-model="loginForm.code" disabled/>
              </el-form-item>
              <div class="buttons">
                <el-button type="primary" native-type="submit">登录档案</el-button>
                <el-button native-type="button" @click="changeAccountType">{{ loginForm.account_type === 'uid' ? '邮箱登录' : 'UID登录' }}</el-button>
                <el-button type="danger" native-type="button">忘记密码</el-button>
                <el-button type="warning" @click="signBoxStatusClicked(1)" native-type="button">注册档案</el-button>
              </div>
            </el-form>
          </div>
          <div v-if="signBoxStatus === 1">
            <h3>注册奶果档案</h3>
            <hr/>
            <el-form label-width="auto" class="signup_form" :model="registerForm" @submit.prevent="registerButtonClicked">
              <el-form-item label="个人昵称：">
                <el-input type="text" placeholder="选填" v-model="registerForm.nickname"/>
              </el-form-item>
              <el-form-item label="电子邮箱：">
                <el-input type="text" placeholder="必填（用于登录）" required v-model="registerForm.email"/>
              </el-form-item>
              <el-form-item label="QQ号：">
                <el-input type="text" placeholder="必填（用于功能解锁）" required v-model="registerForm.qq_id"/>
              </el-form-item>
              <el-form-item label="密码：">
                <el-input type="password" placeholder="必填" required v-model="registerForm.password"/>
              </el-form-item>
              <el-form-item label="确认密码：">
                <el-input type="password" placeholder="必填" required v-model="registerForm.re_password"/>
              </el-form-item>
              <el-form-item label="所在地：">
                <el-input type="password" placeholder="选填（国、省、市、外国、州、府、道、区）" v-model="registerForm.city"/>
              </el-form-item>
              <el-form-item>
                <el-button class="signup_button" native-type="submit">注册档案</el-button>
              </el-form-item>
              <el-form-item>
                <el-button native-type="button" @click="signBoxStatusClicked(0)" class="signin_button">返回登录</el-button>
              </el-form-item>
            </el-form>
          </div>
          <button v-if="signBoxStatus === 0" type="button" @click="changeLoginType" class="change_login_type_button">{{ loginForm.login_type === 'normal' ? '无密码登录' : '普通登录' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes title_logo_in
  0%
    opacity: 0
    top: 0
  100%
    opacity: 1
    top: 14%
@mixin title_logo_in_ani()
  animation: title_logo_in .8s ease forwards
@keyframes sign_bg_in
  0%
    opacity: 0
    top: 45%
  100%
    opacity: 1
    top: 50%
@mixin sign_bg_in_ani()
  animation: sign_bg_in .8s .5s ease forwards
.container
  width: 100%
  height: 100vh
  position: relative
  .sign_form_box
    width: 100%
    height: 100%
    position: absolute
    top: 0
    left: 0
    .sign_bg
      position: absolute
      width: 50%
      height: 50%
      background-color: #ffffff70
      border-radius: 20px
      opacity: 0
      top: 45%
      left: 70%
      transform: translate(-50%, -50%)
      @include sign_bg_in_ani()
      .left_box
        position: absolute
        left: 5%
        transform: translateX(-5%)
        width: 45%
        color: #526139
        font-weight: bold
        hr
          margin: 0 auto
        h4
          font-size: 18px
          margin: 20px
          text-align: center
      .right_box
        position: absolute
        right: 5%
        transform: translateX(5%)
        width: 45%
        color: #7a4956
        font-weight: bold
        hr
          margin: 0 auto
        h4
          font-size: 18px
          margin: 20px
          text-align: center
      .midori
        position: absolute
        width: 20%
        left: 0
        bottom: 0
      .momoi
        position: absolute
        width: 20%
        right: 0
        bottom: 0
      .sign_in_up_box
        border-radius: 20px
        position: absolute
        height: 120%
        width: 50%
        background-color: #ffffff
        top: 50%
        transition: .8s ease
        h3
          text-align: center
          font-size: 24px
          margin: 30px auto
          color: #1289f8
        hr
          width: 90%
        .nopwd_signin_form
          max-width: 85%
          margin: 30px auto 0
          .recode_button:hover
            background-color: #6cbcff
          .recode_button
            width: 100%
            height: 30px
            background-color: #1289f8
            border-radius: 5px
            border: none
            color: #ffffff
            transition: .3s ease
        .signin_form
          max-width: 85%
          margin: 30px auto 0
        .signup_form
          max-width: 85%
          margin: 30px auto 0
          .signup_button:hover
            background-color: #6cbcff
          .signup_button
            width: 100%
            height: 35px
            background-color: #1289f8
            border-radius: 5px
            border: none
            color: #ffffff
            transition: .3s ease
          .signin_button:hover
            background-color: #6cbcff
          .signin_button
            width: 100%
            height: 35px
            background-color: #1289f8
            border-radius: 5px
            border: none
            color: #ffffff
            transition: .3s ease
        .change_login_type_button
          border-radius: 5px
          position: absolute
          bottom: 15%
          width: 85%
          height: 40px
          left: 50%
          transform: translate(-50%)
          background-color: #1289f8
          border: none
          transition: .3s ease
          font-size: 16px
          color: white
        .change_login_type_button:hover
          background-color: #6cbcff
    .title_logo
      position: absolute
      top: 0
      left: 85%
      filter: drop-shadow(0px 0px 4px rgb(255, 255, 255))
      transition: .8s ease
      @include title_logo_in_ani()
</style>