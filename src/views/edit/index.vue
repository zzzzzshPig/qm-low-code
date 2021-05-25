<template>
    <div
        class="main"
        @click="select.noSelect"
    >
        <a-button
            type="primary"
            class="btn-save"
            @click.stop="save"
        >
            保存
        </a-button>

        <div class="component-list">
            <div
                v-for="item in componentList"
                :key="item.name"
                class="item"
                draggable="true"
                @dragstart="drag.start(item)"
                @dragend="drag.restore"
            >
                <img
                    :src="item.image"
                    alt=""
                >

                <div class="label">
                    {{ item.label }}
                </div>
            </div>
        </div>

        <div
            tabindex="-1"
            class="canvas"
            @drop="drag.end"
            @dragover.prevent
            @mousemove="drag.move"
        >
            <div
                v-for="item in components"
                :key="item.id"
                class="cover"
                @click.stop
            >
                <component
                    :is="item.name"
                    draggable="false"
                    v-bind="item.props"
                    @mousedown.stop="drag.moveStart($event, item)"
                />
            </div>
        </div>

        <div
            v-if="select.selectComponent"
            class="prop-list"
            @click.stop
        />
    </div>
</template>

<style scoped lang="less">
    .btn-save {
        position: absolute;
        top: 16px;
        right: 268px;
    }

    .main {
        .relative;
        min-width: 1200px;
        height: 100%;
    }

    .canvas {
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        top: 80px;
        left: 50%;
        width: 375px;
        height: 667px;
        border: 1px solid rgba(0, 0, 0, .1);
        transform: translateX(-50%);
        box-sizing: content-box;

        .component {
            cursor: pointer;
        }

        //.select {
        //    position: absolute;
        //    border: 2px solid #1090ff;
        //    box-sizing: content-box;
        //}
    }

    .component-list {
        .flex-align-start-wrap-justify-between;
        align-content: start;
        position: absolute;
        top: 0;
        left: 0;
        width: 228px;
        height: 100%;
        padding: 16px;
        border-right: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-center-justify-center-column;
            width: 86px;
            height: 86px;
            margin-bottom: 24px;
            border: 1px solid rgba(0, 0, 0, .1);
            cursor: pointer;
            user-select: none;
            border-radius: 4px;

            .image {
                width: 48px;
                height: 48px;
            }
        }
    }

    .prop-list {
        position: absolute;
        top: 0;
        right: 0;
        width: 250px;
        height: 100%;
        padding: 16px;
        border-left: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-start;
            padding: 8px 0;

            .label {
                flex-shrink: 0;
                width: 90px;
                margin: 5px 8px 0 0;
                word-break: break-all;
            }

            .input {
                flex: 1;
                height: 32px;
            }

            .input-color {
                .relative;
                margin-top: 4px;

                .btn-show {
                    width: 60px;
                    height: 24px;
                    border: 1px solid rgba(0, 0, 0, .2);
                    cursor: pointer;
                }

                .picker {
                    z-index: 99;
                    position: absolute;
                    top: 32px;
                    right: -74px;
                }
            }
        }
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
