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
                @click="addComponent(item)"
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
            @click="noSelect"
        >
            <component
                :is="item.name"
                v-for="item in components"
                :key="item.id"
                :style="initComponentStyle(item.props)"
                v-bind="item.props"
                @click.stop="select(item)"
            />

            <div
                v-if="selectComponent"
                class="select"
                :style="cmtSelectStyle"
            />
        </div>

        <div
            v-if="selectComponent"
            class="prop-list"
        >
            <div
                v-for="(item, key) in selectComponent.props"
                :key="key"
                class="item"
            >
                <div class="label">
                    {{ item.label }}：
                </div>

                <a-input
                    v-if="item.type === inputType.string"
                    v-model:value="item.value"
                    class="input"
                    type="text"
                />

                <a-input
                    v-if="item.type === inputType.number"
                    v-model:value="item.value"
                    type="number"
                    class="input"
                />
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
        overflow: hidden;
        position: absolute;
        top: 80px;
        left: 50%;
        width: 375px;
        height: 667px;
        border: 1px solid rgba(0, 0, 0, .1);
        transform: translateX(-50%);

        .select {
            position: absolute;
            border: 2px solid #00b7ff;
            border-radius: 10%;
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
        width: 300px;
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
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
