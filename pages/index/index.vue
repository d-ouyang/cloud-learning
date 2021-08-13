<template>
	<view class="container">
		<view class="content" @click="updateUserProfile">
			<u-avatar size="large" :src="userInfo && userInfo.avatarUrl"></u-avatar>
			<view class="text-area">
				<text class="title">{{userInfo && userInfo.nickname || '微信用户'}}</text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				userInfo: null
			}
		},
		async onLoad() {
			uni.login({
				success(res) {
					if (res.code) {
						//发起网络请求
						uniCloud.callFunction({
							name: 'login',
							data: {
								code: res.code
							},
							success: (res) => {
								console.log(res)
							}
						})
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		},
		methods: {
			// 更新用户信息
			updateUserProfile() {
				console.log(this.userInfo);
			}
		}
	}
</script>

<style>
	.content {
		background-color: #f3f4f5;
		padding: 50rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.text-area {
		margin-top: 20rpx;
	}
</style>
