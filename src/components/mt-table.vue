<template>
	<div class="mt-table" :style="{width:width}">
		<slot name="table"></slot>
	</div>
</template>

<script>
	export default {
		props:['width']
	}
</script>

<style lang="scss" scoped>
	.mt-table {
		width: 100%;
		box-shadow: 0 0 10px lightgray;
		background: white;
		border-radius: 5px;
		margin: 10px;
		table {
			width: 100%;
			tr {
				width: 100%;
				height: 44px;
				line-height: 44px;
				text-align: center;
				&:nth-child(1){
					background: lightblue;
				}
			}
		}
	}
</style>
