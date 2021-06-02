<template>
    <div
        class="main"
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
            class="canvas-box"
            @click="select.noSelect"
        >
            <div
                tabindex="-1"
                class="canvas"
                @click.stop="select.noSelect"
                @drop="drag.end"
                @dragover.prevent
                @mousemove="drag.move"
            >
                <component
                    :is="item.name"
                    v-for="item in components"
                    :key="item.id"
                    v-bind="item.props"
                    @click.stop
                    @mousedown.stop="select.select($event, item)"
                />

                <div
                    v-if="select.selectComponent"
                    :style="select.selectStyle"
                    class="cover"
                    @click.stop
                    @mousedown="select.select($event, select.selectComponent)"
                />
            </div>
        </div>

        <div
            v-if="select.selectProps"
            class="prop-list"
            @click.stop
        >
            <div class="leftRightWidthHeight">
                <div class="item">
                    <div class="label">
                        Left
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.left"
                        class="input"
                    />
                </div>

                <div class="item">
                    <div class="label">
                        Top
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.top"
                        class="input"
                    />
                </div>

                <div class="item">
                    <div class="label">
                        Width
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.width"
                        class="input"
                    />
                </div>

                <div class="item">
                    <div class="label">
                        Height
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.height"
                        class="input"
                    />
                </div>
            </div>

            <div class="rotateOpacityZIndex">
                <div class="item">
                    <div class="label">
                        旋转
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.rotate"
                        class="input"
                    />
                </div>

                <div class="item">
                    <div class="label">
                        不透明度
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.opacity"
                        class="input"
                    />
                </div>

                <div class="item">
                    <div class="label">
                        层级
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.zIndex"
                        class="input"
                    />
                </div>
            </div>

            <div class="background">
                <div class="item">
                    <div class="label">
                        背景颜色
                    </div>

                    <color-picker
                        v-model:value="select.selectProps.backgroundColor"
                    />
                </div>
            </div>

            <div class="border">
                <div class="title">
                    边框
                </div>

                <div class="box">
                    <div class="item">
                        <div class="label">
                            圆角
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.borderRadius"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            粗细
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.borderWidth"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            颜色
                        </div>

                        <color-picker
                            v-model:value="select.selectProps.borderColor"
                            class="input"
                        />
                    </div>
                </div>

                <div class="item-line">
                    <div class="label">
                        风格
                    </div>

                    <a-select
                        v-model:value="select.selectProps.borderStyle"
                        class="select"
                    >
                        <a-select-option
                            v-for="item in borderStyleOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>

            <div
                v-if="propPanel.showFont"
                class="font"
            >
                <div class="title">
                    文字
                </div>

                <div class="box">
                    <div class="item">
                        <div class="label">
                            大小
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.fontSize"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            粗细
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.fontWeight"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            行间距
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.font"
                            class="input"
                        />
                    </div>
                </div>

                <div class="item-line">
                    <div class="label">
                        颜色
                    </div>

                    <color-picker
                        v-model:value="select.selectProps.color"
                    />
                </div>

                <div class="item-line">
                    <div class="label">
                        内容
                    </div>

                    <a-textarea
                        v-model:value="select.selectProps.text"
                        type="textarea"
                    />
                </div>
            </div>

            <div
                v-if="propPanel.showImage"
                class="image"
            >
                <div class="item">
                    <div class="label">
                        图片地址
                    </div>

                    <a-input
                        v-model:value="select.selectProps.src"
                        class="block"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
    .btn-save {
        position: absolute;
        top: 16px;
        right: 288px;
    }

    .main {
        .relative;
        min-width: 1200px;
        height: 100%;
    }

    .canvas-box {
        width: 100%;
        height: 100%;

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

            .cover {
                margin-top: -2px;
                margin-left: -2px;
                border: 2px solid #1090ff;
                box-sizing: content-box;
                cursor: pointer;
            }
        }
    }

    .component-list {
        .flex-align-start-wrap-justify-between;
        align-content: flex-start;
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
        width: 270px;
        height: 100%;
        padding: 8px 16px;
        border-left: 1px solid rgba(0, 0, 0, .1);

        .leftRightWidthHeight, .rotateOpacityZIndex, .border, .background, .font, .image {
            padding: 8px 0;
            border-bottom: 1px solid rgba(0, 0, 0, .1);

            .title {
                .defaultText(16px, #000, 22px, bold);
                margin-bottom: 8px;
            }

            .box {
                .flex-align-center-justify-between;

                ::v-deep {
                    .btn-show {
                        width: 50px;
                    }
                }
            }

            .item-line {
                margin-top: 8px;

                .label {
                    margin-right: 8px;
                    margin-bottom: 4px;
                }

                .select {
                    width: 100%;
                }
            }

            .item {
                margin-right: 8px;

                &:last-child {
                    margin-right: 0;
                }

                .label {
                    text-align: center;
                    margin-bottom: 4px;
                }

                .input {
                    width: 50px;
                    height: 24px;
                    padding: 0;
                    text-align: center;
                }

                .block {
                    width: 100%;
                }
            }
        }

        .background, .image {
            .item .label {
                text-align: left;
            }
        }

        .border {
            .item-line {
                .select {
                    width: 100%;
                }
            }
        }

        .rotateOpacityZIndex {
            .flex-align-center-justify-between;
        }

        .leftRightWidthHeight {
            .flex-align-center-justify-between;
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
