import { LOGIN } from "../constants/actionTypes";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};
