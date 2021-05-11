import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import env from '@/env'

function setHeader (config: AxiosRequestConfig) {
    // config.headers['ac-token'] = ls.get(StorageKeys.TOKEN)
    return config
}

function sendErrorMessage (response: AxiosResponse, { status, code, msg }: { status?: number; code?: number; msg?: string } = {}) {
    const httpCode = status ? `httpCode: ${status}` : ''
    const errCode = code ? `errCode: ${code}` : ''
    const errMsg = msg ? `errMsg: ${msg}` : ''

    message.error(`发生错误：${httpCode} ${errCode} ${errMsg}`)
    return Promise.reject(response)
}

// 生成axios实例
function genAxios (config: AxiosRequestConfig) {
    const ins = axios.create({
        timeout: 20000,
        ...config
    })

    ins.interceptors.request.use((config) => {
        config = setHeader(config)

        return config
    }, (error) => {
        return sendErrorMessage(error, { status: error.status })
    })

    ins.interceptors.response.use((response) => {
        // 提示异常信息
        if (![200, 204, 304].includes(response.status)) {
            return sendErrorMessage(response, {
                status: response.status
            })
        }

        return response
    }, (response) => {
        return sendErrorMessage(response, {
            msg: response.message
        })
    })

    return ins
}

export const zsh = genAxios({
    baseURL: env.zsh
})

zsh.interceptors.response.use((response) => {
    const { data } = response

    if (
        data.error &&
        typeof data.error === 'number' &&
        data.error > 0
    ) {
        return sendErrorMessage(response, { msg: data.message })
    }

    return data
})
