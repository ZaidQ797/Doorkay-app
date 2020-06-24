import * as Actions from '../actions/ActionTypes'
const HomeReducer = (state = { isLoding: false, error: undefined, home_sliders:[], offer_sliders:[], data:[], message:undefined, status:undefined }, action) => {
    switch (action.type) {
        case Actions.HOME_SERVICE_PENDING:
            return Object.assign({}, state, {
               isLoding: true,
            });
        case Actions.HOME_SERVICE_ERROR:
            return Object.assign({}, state, {
                isLoding: false,
                error: action.error
            });
        case Actions.HOME_SERVICE_SUCCESS:

            if(action.data.status != 1){
               return Object.assign({}, state, {
                isLoding: false,
                status: action.data.status,
                message: action.data.message
               });
            }else{

              return Object.assign({}, state, {
                isLoding: false,
                status: action.data.status,
                message: action.data.message,
                data: action.data.result.services,
                home_sliders: action.data.result.home_sliders,
                offer_sliders: action.data.result.offer_sliders,
              });
            } 
        default:
            return state;
    }
}

export default HomeReducer;