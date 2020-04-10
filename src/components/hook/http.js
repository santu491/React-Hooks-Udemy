import { useReducer, useCallback } from "react"
const initialState = {
    loading:false,
    data:null,
    error:null,
    identifier:null,
    reqExtra:null
}

const httpReducer = (state, action) => {
    switch (action.type) {
        case 'START':
            return{
                ...state,
                loading:true,
                data:null,
                error:null,
                identifier:action.identifier,
                reqExtra:action.reqExtra
            }
        case 'SUCCESS':
            return{
                ...state,
                loading:false,
                data:action.payload,
                error:null,
                identifier:action.identifier,
                reqExtra:action.reqExtra
            }
        case "FAIL":
            return{
                ...state,
                loading:false,
                error:action.error,
                identifier:action.identifier,
                reqExtra:action.reqExtra
            }
            case "CLEAR":
                return initialState
            default:
                throw new Error('should not be reached')
    }
}
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

    const clear=useCallback(()=>{
        dispatchHttp(  {
            type:'CLEAR'
        })
    
    },[])

    const sendRequest = useCallback((url, method, body,identifier,reqExtra) => {

        dispatchHttp({type:"START", identifier:identifier, reqExtra:reqExtra})
        fetch(url, {
            method: method,
            body: body,
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then((response) => {
                dispatchHttp({
                    type:'SUCCESS',
                    payload:response,
                    identifier:identifier,
                    reqExtra:reqExtra
                
                })
            }).catch(error => {
                dispatchHttp({
                    type: 'FAIL',
                    error: error.message,
                    identifier:identifier,
                    reqExtra:reqExtra
                })
            })
    },[])

    return{
        loading:httpState.loading,
        error:httpState.error,
        data:httpState.data,
        sendRequest:sendRequest,
        clear:clear,
        identifier:httpState.identifier,
        reqExtra:httpState.reqExtra

    }

}

export default useHttp