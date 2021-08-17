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
			<view v-for="item in bookshelfs" class="u-m-t-20 u-m-b-20">
				<bookshelfcell @removeHandler="onRemoveHandler" :data="item"></bookshelfcell>
			</view>
		</view>
	</view>

</template>

<script>
	import cloudApi from '../../common/cloudApi.js'
	import bookshelfcell from '@/components/dnms-ui/bookshelfcell.vue'
	console.log(cloudApi)
	export default {
		data() {
			return {
				userInfo: null,
				bookshelfs: []
			}
		},
		components: {
			bookshelfcell
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
								this.getbookshelfs()
							}
						})
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		},
		onShow() {
			if (this.userInfo) this.getbookshelfs()
		},
		methods: {
			// 创建书房
			createbookshelf() {
				uni.navigateTo({
					url: '/pages/createbookshelf/createbookshelf'
				})
			},
			// 获取书房
			getbookshelfs() {
				cloudApi.call({
					name: 'bookshelfs',
					data: {
						action: 'read'
					},
					success: (res) => {
						console.log(res);
						this.bookshelfs = res.result
					}
				})
			},
			// 删除书房回调
			onRemoveHandler() {
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				})
				this.getbookshelfs();
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
