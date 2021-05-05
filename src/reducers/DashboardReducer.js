import { LABEL } from "../constants/actionTypes";

export default (state, action) => {
  switch (action.type) {
    case LABEL:
      return {
        ...state,
        labels: [action.payload, ...state.labels],
        data: [0, ...state.data],
      };

    case 'LABEL_REMOVE':
      return {
        ...state,
        labels: state.labels.filter((label) => label.id !== action.payload.id),
      };

    default:
      return state;
  }
};
