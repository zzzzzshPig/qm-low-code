<template>
    <a-popover
        placement="left"
        overlay-class-name="popover-color-picker"
        trigger="click"
        destroy-tooltip-on-hide
    >
        <template #content>
            <color-picker
                class="picker"
                style="width: 220px"
                :color="value"
                @changeColor="change"
            />
        </template>

        <div
            class="btn-show"
            :style="{
                backgroundColor: value
            }"
        />
    </a-popover>
</template>

<style scoped lang="less">
    .btn-show {
        height: 24px;
        border: 1px solid rgba(0, 0, 0, .1);
    }
</style>

<style lang="less">
    .popover-color-picker {
        padding-top: 0;

        .ant-popover-arrow {
            display: none;
        }

        .ant-popover-inner-content {
            padding: 0;
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
