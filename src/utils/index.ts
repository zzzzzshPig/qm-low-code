
type MyFunction = (...args: unknown[]) => unknown

// 防抖
export function useDebounce () {
    let timer = 0

    function apply (fn: MyFunction, delay: number) {
        clearTimeout(timer)

        timer = setTimeout(fn, delay)
    }

    return {
        apply
    }
}
