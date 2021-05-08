import { LABEL } from "../constants/actionTypes";

const DashboardReducer = (state, action) => {
  switch (action.type) {
    case LABEL:
      console.log(action.payload); 
      return {
        ...state,
        labels: [action.payload.labels, ...state.labels],
        data: [action.payload.data, ...state.data],
      };

    default:
      return state;
  }
};

export default DashboardReducer; 
