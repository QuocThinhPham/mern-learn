export const API_URL =
    process.env.NODE_ENV !== 'production'
        ? 'http://localhost:8000/api'
        : 'https://salty-harbor-56413.herokuapp.com/api';
export const TOKEN_NAME = 'social-app';

export const SET_AUTH = 'SET_AUTH';
export const POST_LOADED_SUCCESS = 'POST_LOADED_SUCCESS';
export const POST_LOADED_FAILURE = 'POST_LOADED_FAILURE';
export const POST_FIND = 'POST_FIND';
export const POST_ADDED_SUCCESS = 'POST_ADDED_SUCCESS';
export const POST_ADDED_FAILURE = 'POST_ADDED_FAILURE';
export const POST_UPDATED_SUCCESS = 'POST_UPDATED_SUCCESS';
export const POST_UPDATED_FAILURE = 'POST_UPDATED_FAILURE';
export const POST_DELETED_SUCCESS = 'POST_DELETED_SUCCESS';
export const POST_DELETED_FAILURE = 'POST_DELETED_FAILURE';
