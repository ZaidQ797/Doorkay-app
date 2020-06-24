import * as Actions from '../actions/ActionTypes'
const FaqReducer = (state = { new_location:undefined }, action) => {
    switch (action.type) {
        case Actions.UPDATE_LOCATION:
            return Object.assign({}, state, {
               new_location: action.data,
            });
        default:
            return state;
    }
}

export default FaqReducer;
