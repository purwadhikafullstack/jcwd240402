const initialState = {
    cities: [],
    warehouses: [],
    admins: [],
    error: null,
};

export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADMIN_LOAD_CITIES_SUCCESS':
            return { ...state, cities: action.payload };
        case 'ADMIN_LOAD_WAREHOUSES_SUCCESS':
            return { ...state, warehouses: action.payload };
        case 'ADMIN_LOAD_ADMINS_SUCCESS':
            return { ...state, admins: action.payload };
        case 'ADMIN_LOAD_CITIES_FAIL':
        case 'ADMIN_LOAD_WAREHOUSES_FAIL':
        case 'ADMIN_LOAD_ADMINS_FAIL':
            return { ...state, error: action.error };
        default:
            return state;
    }
};


