<template>
	<view style="width: 100%;height: 100vh;">
		<map 
			style="width: 100%;height: 100%;"
			:markers="markers"
			:longitude="longitude"
			:latitude="latitude"
			:show-location="true"
			@bindregionchange="bindregionchange"
			@bindmarkertap="bindmarkertap"
		>
		</map>
	</view>
</template>

<script>
	import cloudApi from '@/common/cloudApi.js'
	export default {
		data() {
			return {
				latitude: '',
				longitude: '',
				markers: []
			}
		},
		onLoad() {
			uni.getLocation({
				success: (res) => {
					this.latitude = res.latitude
					this.longitude = res.longitude
				}
			})
		},
		methods: {
			bindregionchange(e) {
				console.log(e)
			},
			// 获取markers图标
			getMarkers() {
				cloudApi.call({
					name: 'bookshelfs',
					data: {
						action: 'listbygeo',
						longitude: this.longitude,
						latitude: this.latitude
					},
					success: (res) => {
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style>

</style>
