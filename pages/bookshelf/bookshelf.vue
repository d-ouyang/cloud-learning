<template>
	<view class="container">
		<canvas id="myPoster" canvas-id="myPoster" type="2d" style="position: absolute;left:-350px;width:350px;height:750px;"></canvas>
		<view class="u-flex u-flex-wrap u-row-between u-p-b-150">
			<view v-for="item in books" style="width:33.3%;padding:10px;margin-bottom: 10px;">
				<bookcell :data="item"></bookcell>
				<view v-if="isEditing" @click="btnDeleteBook" :data-id="item._id" style='font-size:10px;text-align:center;margin-top: 10px;'><text style="padding:5px 10px;background:#f3433e;color:#fff;border-radius:5px;">编辑</text></view>
			</view>
		</view>
		<view class="actions-wrapper u-flex u-row-between">
			<button class="share-btn u-reset-button" open-type="share">
				<u-icon name="share" size="40"></u-icon>
			</button>
			<view class="add-book" @click="addBook">
				添加图书
			</view>
			<u-icon name="grid" size="40"></u-icon>
		</view>
	</view>
</template>

<script>
	import cloudApi from '@/common/cloudApi.js'
	import bookcell from '@/components/dnms-ui/bookcell.vue'
	export default {
		data() {
			return {
				option: null,
				isEditing: false,
				books: []
			}
		},
		components: {
			bookcell
		},
		onLoad(option) {
			if (option && option.id) {
				this.option = option
				cloudApi.call({
					name: 'bookshelfs',
					data: {
						action: 'readOne',
						_id: option.id
					},
					success: (res) => {
						console.log(res)
						const bookshelf = res.result[0]
						this.name = bookshelf.name
						this.address = bookshelf.address
						this.longitude = bookshelf.geopoint.coordinates[0],
						this.latitude = bookshelf.geopoint.coordinates[1]
						uni.setNavigationBarTitle({
							title: bookshelf.name
						})
					}
				})
			}
		},
		methods: {
			// 添加图书
			addBook() {
				uni.scanCode({
					success: (res) => {
						console.log(res)
					}
				})
			},
			btnDeleteBook() {
				console.log('删除图书')
			}
		}
	}
</script>

<style scoped lang="scss">
.container {
	width: 100%;
	height: 100vh;
}
.actions-wrapper {
	position: fixed;
	z-index: 10;
	width: 710rpx;
	height: 100rpx;
	border-radius: 50rpx;
	background: #1a1a1a;
	left: 20rpx;
	bottom: 30rpx;
	color: #fff;
	padding: 0 20rpx;
	.share-btn {
		display: inline-block;
		margin: 0;
	}
}
.add-book {
	flex: 1;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
}
</style>
