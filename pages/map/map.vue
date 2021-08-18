<template>
	<view style="width: 100%;height: 100vh;">
		<map 
			v-if="latitude && longitude"
			style="width: 100%;height: 100%;"
			:markers="markers"
			:longitude="longitude"
			:latitude="latitude"
			:show-location="true"
			@regionchange="onRegionChange"
			@markertap="onMarkerTap"
		>
		</map>
	</view>
</template>

<script>
	import cloudApi from '@/common/cloudApi.js'
	
	let shelfs = [];
	export default {
		data() {
			return {
				latitude: '',
				longitude: '',
				markers: []
			}
		},
		onLoad() {
			
		},
		onShow() {
			uni.getLocation({
				success: (res) => {
					console.log(res);
					this.latitude = res.latitude
					this.longitude = res.longitude
					this.getMarkers(res)
				}
			})
		},
		methods: {
			// 点击marker
			onMarkerTap(e) {
				console.log(e);
				const shelf = shelfs[e.detail.markerId]
				console.log(shelf)
				uni.navigateTo({
					url:"/pages/createbookshelf/createbookshelf?id="+shelf._id
				})
			},
			// 视野变化
			onRegionChange(e) {
				console.log(e)
				if (e.type === 'end') {
					const location = e.detail.centerLocation
					// this.longitude = location.longitude
					// this.latitude = location.latitude
					this.getMarkers(location)
				}
			},
			// 获取markers图标
			getMarkers(location) {
				cloudApi.call({
					name: 'bookshelfs',
					data: {
						action: 'listbygeo',
						longitude: location.longitude,
						latitude: location.latitude
					},
					success: (res) => {
						console.log(res)
						shelfs = res.result
						const markers = []
						shelfs.map((item, index) => {
							markers.push({
								id: index,
								width:55,
								height:60,
								iconPath:"/static/mapmarker_shelf.png",
								longitude:item.geopoint.coordinates[0],
								latitude:item.geopoint.coordinates[1]
							})
						})
						this.markers = markers
					}
				})
			}
		}
	}
</script>

<style>

</style>
