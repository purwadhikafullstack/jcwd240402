const initialState = {
    cities: [],
    warehouses: [],
    admins: [],
    error: null,
};

export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_CITIES_SUCCESS':
            return { ...state, cities: action.payload };
        case 'LOAD_WAREHOUSES_SUCCESS':
            return { ...state, warehouses: action.payload };
        case 'LOAD_ADMINS_SUCCESS':
            return { ...state, admins: action.payload };
        case 'LOAD_CITIES_FAIL':
        case 'LOAD_WAREHOUSES_FAIL':
        case 'LOAD_ADMINS_FAIL':
            return { ...state, error: action.error };
        default:
            return state;
    }
};


