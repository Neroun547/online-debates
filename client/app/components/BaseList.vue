<template>
	<div>
		<ul class="list-disc mt-10">
			<li
				v-for="item in props.items"
				:key="item.id"
				class="text-primary text-xl text-left mt-3 list-inside"
				style="list-style-type: disclosure-closed; color: rgb(174, 174, 174)"
			>
				<span
v-if="item.emoji"
class="mr-2"
>{{ item.emoji }}</span>
				<ULink
					v-if="item.isLink"
					class="text-primary cursor-pointer underline max-sm:text-base"
					:to="item.link"
				>
					{{ item.title }}
				</ULink>
				<span v-if="!item.isLink">{{ item.title }}</span>
				<div v-if="item.subjects">
					<ULink :key="subject.id" v-for="subject in item.subjects" :to="'/categories/' + item.id + '/subjects/' + subject.id" class="text-sm underline text-primary ml-5 max-md:text-xs">{{ subject.name }}</ULink>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
export interface ListItem {
	isLink: boolean
	link: string
	title: string
	emoji?: string
	[key: string]: any
}
interface Props {
	items: Array<ListItem>
}

const props = defineProps<Props>()
</script>
