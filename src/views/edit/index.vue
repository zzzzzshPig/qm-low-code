<template>
    <div class="main">
        <a-button
            type="primary"
            class="btn-save"
            @click="save"
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
            class="canvas"
            @drop="drag.end"
            @dragover.prevent
            @mousemove="drag.move"
            @click="select.noSelect"
        >
            <div
                v-if="select.selectComponent"
                class="select"
                :style="select.cmtSelectStyle"
            />

            <component
                :is="item.name"
                v-for="item in components"
                :key="item.id"
                draggable="false"
                :style="initComponentStyle(item.props)"
                v-bind="item.props"
                @click.stop
                @mousedown.stop="drag.moveStart($event, item);select.select(item)"
            />
        </div>

        <div
            v-if="select.selectComponent"
            class="prop-list"
        >
            <div
                v-for="(item, key) in select.selectComponent.props"
                :key="key"
                class="item"
            >
                <div class="label">
                    {{ item.label }}：
                </div>

                <a-input
                    v-if="item.type === propPanel.type.string"
                    v-model:value="item.value"
                    class="input"
                    type="text"
                />

                <a-input
                    v-if="item.type === propPanel.type.number"
                    :value="item.value"
                    type="number"
                    class="input"
                    @change="propPanel.changeNumber($event, item)"
                />

                <div
                    v-if="item.type === propPanel.type.color"
                    class="input-color"
                    @click.stop
                >
                    <div
                        class="box"
                        :style="{
                            backgroundColor: item.value
                        }"
                        @click="colorPicker.show(key)"
                    />

                    <color-picker
                        v-if="colorPicker.canShowItem(key)"
                        class="picker"
                        style="width: 220px"
                        :color="item.value"
                        @changeColor="colorPicker.change($event, item)"
                    />
                </div>

                <a-select
                    v-if="item.type === propPanel.type.select"
                    v-model:value="item.value"
                    class="input"
                >
                    <a-select-option
                        v-for="s in item.list"
                        :key="s.value"
                        :value="s.value"
                    >
                        {{ s.label }}
                    </a-select-option>
                </a-select>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
    .btn-save {
        position: absolute;
        top: 16px;
        right: 316px;
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

        .select {
            position: absolute;
            border: 2px solid #00b7ff;
        }
    }

    .component-list {
        .flex-align-start-wrap;
        position: absolute;
        top: 0;
        left: 0;
        width: 228px;
        height: 100%;
        padding: 16px;
        border-right: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-center-justify-center-column;
            width: 90px;
            height: 90px;
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

                .box {
                    width: 60px;
                    height: 24px;
                    border: 1px solid rgba(0, 0, 0, .2);
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

<script lang="ts" src="./index.ts"></script>
