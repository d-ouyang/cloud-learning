<template>
	<view class="container">
		<view class="content" @click="updateUserProfile">
			<u-avatar size="large" :src="userInfo && userInfo.avatarUrl"></u-avatar>
			<view class="text-area">
				<text class="title">{{userInfo && userInfo.nickName || ''}}</text>
			</view>
		</view>
		<view style="padding: 20rpx;">
			<u-button @click="createbookshelf" type="primary" :ripple="true" ripple-bg-color="#909399">新建书房</u-button>
			<view v-for="item in bookshelfs" style="margin-bottom: 10px;">
				<bookshelfcell @removeHandler="onRemoveHandler" :data="item"></bookshelfcell>
			</view>
		</view>
	</view>

</template>

<script>
	import cloudApi from '../../common/cloudApi.js'
	console.log(cloudApi)
	export default {
		data() {
			return {
				userInfo: null,
				bookshelfs: []
			}
		},
		async onLoad() {
			uni.login({
				success: (res)=> {
					if (res.code) {
						//发起网络请求
						cloudApi.call({
							name: 'login',
							data: {
								code: res.code
							},
							success: (res) => {
								console.log(res)
								this.userInfo = res.result
							}
						})
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		},
		methods: {
			// 创建书房
			createbookshelf() {
				uni.navigateTo({
					url: '/pages/createbookshelf/createbookshelf'
				})
			},
			// 更新用户信息
			updateUserProfile() {
				console.log(this.userInfo);
				uni.getUserProfile({
					desc: '就是想用',
					success: (res) => {
						console.log(res)
						this.userInfo = {
							...this.userInfo,
							...res.userInfo
						}
						cloudApi.call({
							name: 'updateUserProfile',
							data: {
								userInfo: this.userInfo
							},
							success: (res) => {
								console.log(res)
							}
						})
					}
				})
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
