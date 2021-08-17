<template>
	<view>
		<view class="u-m-b-20">
			<u-cell-group>
				<u-cell-item border-bottom :arrow="false" title-width="130" icon="setting-fill" title="书房名称">
					<u-input maxlength="20" placeholder="请输入书房名称" v-model="name" type="text" />
				</u-cell-item>
				<u-cell-item border-bottom title-width="130" @click="btnChooseLocation" icon="integral-fill" title="书房地址" :value="address"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-p-20">
			<u-button class="u-m-20" @click="btnSaveBookshelf" type="primary" :ripple="true" ripple-bg-color="#909399">保存</u-button>
		</view>
	</view>
</template>

<script>
	const cloudApi = require('../../common/cloudApi.js')
	export default {
		data() {
			return {
				address: '',
				name: '',
				longitude: '',
				latitude: '',
				option: null
			}
		},
		onLoad(option) {
			if (option.id) {
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
					}
				})
			}
		},
		methods: {
			btnSaveBookshelf() {
				if (!this.name) {
					return uni.showToast({
						title: '书房名称不能为空',
						icon: 'none'
					})
				} else if (this.name.length < 3) {
					return uni.showToast({
						title: '书房名称至少三个字符',
						icon: 'none'
					})
				}
				if (!this.address || !this.longitude || !this.latitude) {
					return uni.showToast({
						title: '请选择正确的地址',
						icon: 'none'
					})
				}
				cloudApi.call({
					name: 'bookshelfs',
					data: {
						_id: this.option && this.option.id || 0,
						action: this.option && this.option.id ? 'update' : 'create',
						name: this.name,
						address: this.address,
						longitude: this.longitude,
						latitude: this.latitude
					},
					success: () => {
						uni.navigateBack()
					}
				})
			},
			btnChooseLocation() {
				uni.getLocation({
					success: (res) => {
						uni.chooseLocation({
							latitude:res.latitude,
							longitude:res.longitude,
							success: (res) => {
								console.log(res);
								this.address= res.address+res.name;
								this.longitude=res.longitude;
								this.latitude=res.latitude;
							}
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
