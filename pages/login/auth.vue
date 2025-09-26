<template>
  <view class="container">
    <view class="wechatapp">
      <view class="header"></view>
    </view>
    <view class="auth-title">申请获取以下权限</view>
    <view>
      <view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view>
      <view class="login-btn">
        <button class="button btn-normal" :disabled="isLoading" @click.stop="doLogin">
          {{ isLoading ? '登录中...' : '授权登录' }}
        </button>
      </view>
    </view>
    <view class="no-login-btn">
      <button class="button btn-normal" :disabled="isLoading" @click="handleCancel">
        暂不登录1
      </button>
    </view>
  </view>
</template>

<script>
import store from '@/store'
import * as LoginApi from '@/api/login'
export default {

  data() {
    return {
      code: '', // 微信授权码
      isLoading: false // 加载状态
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面参数:', options);

    // 优先从页面参数获取code
    if (options.code) {
      this.code = options.code;
      console.log('从页面参数获取到code:', this.code);
    } else {
      // 尝试从URL参数获取code
      this.code = this.getCodeFromUrl();
      if (this.code) {
        console.log('从URL获取到code:', this.code);
      } else {
        console.warn('未获取到微信授权码');
      }
    }
  },

  methods: {
    /**
     * 开始登录流程
     */
    doLogin() {
      this.doAuth();
    },

    /**
     * 微信授权登录
     */
    async doAuth() {
      const app = this;

      // 检查是否有授权码
      if (!app.code) {
        app.$toast("抱歉，授权失败！未获取到授权码");
        setTimeout(() => {
          app.$navTo('pages/user/index');
        }, 1000);
        return false;
      }

      // 设置加载状态
      app.isLoading = true;

      try {
        // 获取分享ID（如果有的话）
        // const shareId = uni.getStorageSync('shareId') || 0;



        // 提交到后端进行微信授权登录
        const result = await store.dispatch('MpWxLogin', {
          "scene": "mnp",
          "client": 1,
          "mobile": "",
          "password": "",
          "code": app.code
        });

        console.log('授权登录结果:', result);
        console.log('返回的token:', result.data?.token);
        console.log('返回的userId:', result.data?.userId);

        if (result.code === 200) {
          // 登录成功
          app.$toast(result.message || '登录成功');
          // 跳转到用户页面
          setTimeout(() => {
            app.$navTo('pages/user/index');
          }, 1000);
        } else {
          // 登录失败
          app.$toast(result.message || '登录失败，请重试');
          // 清除登录状态
          store.dispatch('Logout');
        }
      } catch (error) {
        console.error('授权登录错误:', error);
        app.$toast("网络错误，请检查网络连接后重试");
        // 清除登录状态
        store.dispatch('Logout');
      } finally {
        // 取消加载状态
        app.isLoading = false;
      }
    },

    /**
     * 从URL中获取code参数
     * 兼容不同平台的URL参数获取方式
     */
    getCodeFromUrl() {
      // 在uni-app中，可以通过以下方式获取URL参数
      // 1. 尝试从当前页面URL获取
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];

      if (currentPage && currentPage.options && currentPage.options.code) {
        return currentPage.options.code;
      }

      // 2. 尝试从window.location获取（H5环境）
      if (typeof window !== 'undefined' && window.location) {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
          let pair = vars[i].split("=");
          if (pair[0] === 'code') {
            return decodeURIComponent(pair[1]);
          }
        }
      }

      return null;
    },

    /**
     * 暂不登录
     */
    handleCancel() {
      // 清除登录状态
      store.dispatch('Logout');
      // 跳转回用户页面
      this.$navTo('pages/user/index');
    },

    /**
     * 返回上一页
     */
    onNavigateBack(delta = 1) {
      uni.navigateBack({
        delta: Number(delta)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 60rpx;
  font-size: 32rpx;
  background: #fff;
  min-height: 100vh;
}

.wechatapp {
  padding: 80rpx 0 48rpx;
  border-bottom: 1rpx solid #e3e3e3;
  margin-bottom: 72rpx;
  text-align: center;

  .header {
    width: 190rpx;
    height: 190rpx;
    border: 4rpx solid #fff;
    margin: 0 auto 0;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 2rpx 0 10rpx rgba(50, 50, 50, 0.3);
  }
}

.auth-title {
  color: #585858;
  font-size: 34rpx;
  margin-bottom: 40rpx;
}

.auth-subtitle {
  color: #888;
  margin-bottom: 88rpx;
  font-size: 28rpx;
}

.login-btn {
  padding: 0 20rpx;

  .button {
    height: 88rpx;
    line-height: 88rpx;
    background: $fuint-theme;
    color: #fff;
    font-size: 30rpx;
    border-radius: 12rpx;
    text-align: center;
    border: none;
    transition: opacity 0.3s ease;

    &:disabled {
      opacity: 0.6;
      background: #ccc;
    }
  }
}

.no-login-btn {
  margin-top: 24rpx;
  padding: 0 20rpx;

  .button {
    height: 88rpx;
    line-height: 88rpx;
    background: #dfdfdf;
    color: #fff;
    font-size: 30rpx;
    border-radius: 12rpx;
    text-align: center;
    border: none;
    transition: opacity 0.3s ease;

    &:disabled {
      opacity: 0.6;
      background: #ccc;
    }
  }
}
</style>