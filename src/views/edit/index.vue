<template>
    <div
        class="main"
    >
        <a-button
            type="primary"
            class="btn-save"
            @click.stop="action.save"
        >
            保存
        </a-button>

        <a-button
            class="btn-preview"
            @click.stop="action.preview"
        >
            预览
        </a-button>

        <a-button
            class="btn-prepublish"
            @click.stop="action.prepublish"
        >
            预发布
        </a-button>

        <a-button
            disabled
            class="btn-publish"
            @click.stop="action.publish"
        >
            发布
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
                    class="image"
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
            @mousedown="select.drawCheckBox"
            @drop="drag.end"
            @dragover.prevent
        >
            <img
                src="./images/iphone.svg"
                alt=""
                class="bg"
            >

            <div
                class="canvas"
            >
                <div
                    v-for="item in components"
                    :key="item.id"
                    @mousedown.stop="select.select($event, item)"
                >
                    <component
                        :is="item.name"
                        v-bind="item.props"
                    />
                </div>
            </div>

            <div
                :style="select.checkBoxStyle"
                class="check-box"
            />

            <div
                :style="select.boxStyle"
                :class="{
                    'component-check-box': select.selectComponent.length > 1,
                    'component-select-box': select.selectComponent.length === 1
                }"
                @mousedown.stop="drag.moveStart($event)"
                @click.stop
            >
                <div
                    v-if="select.selectComponent"
                    class="dots"
                >
                    <div
                        class="dot leftTop"
                        @mousedown.stop="scale.scale($event, [1, 1, -1, -1])"
                    />

                    <div
                        class="dot top"
                        @mousedown.stop="scale.scale($event, [1, 0, 0, -1])"
                    />

                    <div
                        class="dot rightTop"
                        @mousedown.stop="scale.scale($event, [1, 0, 1, -1])"
                    />

                    <div
                        class="dot right"
                        @mousedown.stop="scale.scale($event, [0, 0, 1, 0])"
                    />

                    <div
                        class="dot rightBottom"
                        @mousedown.stop="scale.scale($event, [0, 0, 1, 1])"
                    />

                    <div
                        class="dot bottom"
                        @mousedown.stop="scale.scale($event, [0, 0, 0, 1])"
                    />

                    <div
                        class="dot leftBottom"
                        @mousedown.stop="scale.scale($event, [0, 1, -1, 1])"
                    />

                    <div
                        class="dot left"
                        @mousedown.stop="scale.scale($event, [0, 1, -1, 0])"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="select.selectProps"
            class="prop-list"
            @keydown.stop="select.keydown"
            @click.stop
        >
            <div class="prop-block">
                <div class="box">
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

                <div class="box">
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

                <div class="item-line">
                    <div class="label">
                        背景颜色
                    </div>

                    <color-picker
                        v-model:value="select.selectProps.backgroundColor"
                        class="input-color"
                    />
                </div>
            </div>

            <div class="prop-block">
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
                        />
                    </div>
                </div>

                <div class="item-line">
                    <div class="label">
                        风格
                    </div>

                    <a-select
                        v-model:value="select.selectProps.borderStyle"
                        class="input"
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
                class="prop-block"
            >
                <div class="title">
                    文本
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
                            v-model:value="select.selectProps.lineHeight"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            字间距
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.letterSpacing"
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
                        class="input-color"
                    />
                </div>

                <div class="item-line">
                    <div class="label">
                        内容
                    </div>

                    <a-textarea
                        v-model:value="select.selectProps.text"
                        class="input"
                        type="textarea"
                    />
                </div>
            </div>

            <div
                v-if="propPanel.showComponentProps"
                class="prop-block"
            >
                <div class="title">
                    组件属性
                </div>

                <!-- 图片相关 -->
                <div
                    v-if="propPanel.showImage"
                    class="item-line"
                >
                    <div class="label">
                        图片地址
                    </div>

                    <a-input
                        v-model:value="select.selectProps.src"
                        class="input"
                    />
                </div>

                <!-- 输入框相关 -->
                <div
                    v-if="propPanel.showInput"
                    class="item-line"
                >
                    <div class="label">
                        id
                    </div>

                    <a-input
                        v-model:value="select.selectProps.id"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showInput"
                    class="item-line"
                >
                    <div class="label">
                        提示文字
                    </div>

                    <a-input
                        v-model:value="select.selectProps.placeholder"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showInput"
                    class="item-line"
                >
                    <div class="label">
                        类型
                    </div>

                    <a-select
                        v-model:value="select.selectProps.inputType"
                        class="input"
                    >
                        <a-select-option
                            v-for="item in inputTypeOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>

                <!-- 按钮相关 -->
                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        输入框id
                    </div>

                    <a-input
                        v-model:value="select.selectProps.inputId"
                        class="input"
                        placeholder="输入框的id属性"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        楼盘id
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.houseId"
                        placeholder="填单会算到此楼盘"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        短信验证
                    </div>

                    <a-checkbox
                        v-model:checked="select.selectProps.shouldMsgCode"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        弹窗标题
                    </div>

                    <a-input
                        v-model:value="select.selectProps.buttonTitle"
                        placeholder="点击后弹窗标题"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        弹窗正文
                    </div>

                    <a-input
                        v-model:value="select.selectProps.buttonTip"
                        placeholder="点击后弹窗正文"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        弹窗按钮
                    </div>

                    <a-input
                        v-model:value="select.selectProps.buttonBtnText"
                        placeholder="点击后弹窗按钮文字"
                        class="input"
                    />
                </div>

                <!-- 超链接相关 -->
                <div
                    v-if="propPanel.showLink"
                    class="item-line"
                >
                    <div class="label">
                        链接地址
                    </div>

                    <a-input
                        v-model:value="select.selectProps.href"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showLink"
                    class="item-line"
                >
                    <div class="label">
                        跳转方式
                    </div>

                    <a-select
                        v-model:value="select.selectProps.target"
                        class="input"
                    >
                        <a-select-option
                            v-for="item in linkTargetOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
    .btn-save, .btn-preview, .btn-publish, .btn-prepublish {
        position: absolute;
        right: 288px;

        &.btn-save {
            top: 16px;
        }

        &.btn-preview {
            top: 64px;
        }

        &.btn-prepublish {
            top: 112px;
        }

        &.btn-publish {
            top: 160px;
        }
    }

    .main {
        .relative;
        min-width: 1200px;
        height: 100%;
    }

    .canvas-box {
        .relative;
        z-index: 0;
        width: 100%;
        height: 100%;
        user-select: none;

        .check-box {
            z-index: 999999999999999999999;
            position: absolute;
            background: rgba(100, 170, 255, 0.1);
            border: 1px solid rgba(0, 0, 0, .4);
            box-sizing: border-box;
        }

        .canvas {
            z-index: auto;
            overflow-x: hidden;
            overflow-y: auto;
            position: absolute;
            top: 120px;
            left: 50%;
            width: 375px;
            height: 667px;
            background: #fff;
            margin-left: -187.5px;

            /*滚动条样式*/
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width:4px;/*高宽分别对应横竖滚动条的尺寸*/
                height:4px;
            }

            &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius:5px;
                -webkit-box-shadow: inset005pxrgba(0,0,0,0.2);
                background:rgba(0,0,0,0.2);
            }

            &::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset005pxrgba(0,0,0,0.2);
                border-radius:0;
                background:rgba(0,0,0,0.1);
            }
        }

        .bg {
            position: absolute;
            top: 13px;
            left: 50%;
            width: 436px;
            height: 881px;
            transform: translateX(-50%);
            -webkit-user-drag: none;
        }

        .component-check-box, .component-select-box {
            position: absolute;
            border: 1px dashed #808080;
            cursor: move;

            &.component-select-box {
                border: 2px solid #1090ff;
            }

            .dot {
                position: absolute;
                width: 6px;
                height: 6px;
                background: #fff;
                border: 1px solid #1090ff;
                border-radius: 50%;

                &.leftTop {
                    top: -4px;
                    left: -4px;
                    cursor: nwse-resize;
                }

                &.top {
                    top: -4px;
                    left: 50%;
                    margin-left: -3px;
                    cursor: ns-resize;
                }

                &.rightTop {
                    top: -4px;
                    right: -4px;
                    cursor: nesw-resize;
                }

                &.right {
                    top: 50%;
                    right: -4px;
                    margin-top: -3px;
                    cursor: ew-resize;
                }

                &.rightBottom {
                    right: -4px;
                    bottom: -4px;
                    cursor: nwse-resize;
                }

                &.bottom {
                    bottom: -4px;
                    left: 50%;
                    margin-left: -3px;
                    cursor: ns-resize;
                }

                &.leftBottom {
                    left: -4px;
                    bottom: -4px;
                    cursor: nesw-resize;
                }

                &.left {
                    top: 50%;
                    left: -4px;
                    margin-top: -3px;
                    cursor: ew-resize;
                }
            }
        }
    }

    .component-list {
        .flex-align-start-wrap-justify-between;
        z-index: 1;
        align-content: flex-start;
        position: absolute;
        top: 0;
        left: 0;
        width: 228px;
        height: 100%;
        padding: 16px;
        background: #fff;
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
                -webkit-user-drag: none;
            }
        }
    }

    .prop-list {
        z-index: 1;
        position: absolute;
        top: 0;
        right: 0;
        width: 270px;
        height: 100%;
        padding: 8px 16px;
        background: #fff;
        border-left: 1px solid rgba(0, 0, 0, .1);

        .prop-block {
            padding: 8px 0;
            border-bottom: 1px solid rgba(0, 0, 0, .1);

            .title {
                .defaultText(16px, #000, 22px, bold);
                margin-bottom: 8px;
            }

            .box {
                .flex-align-center-justify-between;
                margin-bottom: 8px;

                ::v-deep {
                    .btn-show {
                        width: 50px;
                    }
                }
            }

            .item-line {
                .flex-align-center;
                margin-top: 16px;

                .label {
                    width: 60px;
                    flex-shrink: 0;
                    margin-top: 4px;
                    margin-right: 8px;
                    margin-bottom: 4px;
                }

                .input {
                    width: 100%;
                }

                ::v-deep {
                    .input-color {
                        width: 88px;
                    }
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
            }
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
