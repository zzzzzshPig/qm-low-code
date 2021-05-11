import { zsh } from '@/apis/index'
import { EditComponent } from '@/views/edit/types'
import { BaseResZsh } from '@/apis/type'

interface GetDataReq {
    id: number
}

type GetDataRes = EditComponent[]

interface SaveDataReq {
    id: number
    data: EditComponent[]
}

class Edit {
    getData (data: GetDataReq): BaseResZsh<GetDataRes> {
        return zsh.post('/edit/get', data)
    }

    saveData (data: SaveDataReq) {
        return zsh.post('/edit/save', data)
    }
}

export const apiEdit = new Edit()
