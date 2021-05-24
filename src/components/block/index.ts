import { stringProp } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZBlock',

    props: {
        backgroundColor: stringProp('#000')
    },

    setup () {
        return {
        }
    }
})
