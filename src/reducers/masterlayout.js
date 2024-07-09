import {
    LAYOUT_API_FAILURE,
    LAYOUT_API_REQUEST,
    LAYOUT_API_SUCCESS,
} from '../commonHelper/Constants';

const initialState = {
    isLoading: true,
};
 
export const homeLayout = (state = initialState, action) => {
    switch (action.type) {
        case LAYOUT_API_REQUEST:
            return Object.assign({}, state, {
                ...state,
                isLoading: true,
            });
        case LAYOUT_API_SUCCESS:
            return Object.assign({}, state, {
                ...state,
                data: action.payload.data,
                isLoading: false,
            });
        case LAYOUT_API_FAILURE:
            return Object.assign({}, state, {
                ...state,
                isLoading: false,
                error: action.payload,
            });
        default:
            return state;
    }
};
