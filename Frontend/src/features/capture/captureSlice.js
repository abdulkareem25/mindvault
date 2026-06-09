import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  classificationResult: null,
  isClassifying: false,
};

export const captureSlice = createSlice({
  name: 'capture',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.classificationResult = null;
    },
    setClassificationResult: (state, action) => {
      state.classificationResult = action.payload;
    },
    setIsClassifying: (state, action) => {
      state.isClassifying = action.payload;
    },
  },
});

export const { openModal, closeModal, setClassificationResult, setIsClassifying } = captureSlice.actions;
export default captureSlice.reducer;
