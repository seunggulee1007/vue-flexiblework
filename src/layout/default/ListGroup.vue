<template>
    <v-list-group eager v-bind="$attrs" :no-action="prependYn" :sub-group="prependYn">
        <template v-slot:activator>
            <v-list-item-content>
                <v-list-item-title>
                    {{ item.name }}
                </v-list-item-title>
            </v-list-item-content>
        </template>
        <template v-for="(child, i) in item.children">
            <default-list-group
                v-if="child.children && child.children.length > 0"
                :key="`sub-group-${i}`"
                :item="child"
                :prependYn="true"
            />
            <default-list-item v-else :key="`child-${i}`" :item="child" />
        </template>
    </v-list-group>
</template>
<script>
import DefaultListItem from './ListItem';
export default {
    name: 'DefaultListGroup',
    components: {
        DefaultListItem,
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        prependYn: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
<style lang=""></style>
