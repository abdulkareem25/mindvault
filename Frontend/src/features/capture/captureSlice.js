import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  content: '',
  classification: null,
  isClassifying: false,
  isSaving: false,
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
      state.content = '';
      state.classification = null;
      state.isClassifying = false;
      state.isSaving = false;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setClassification: (state, action) => {
      state.classification = action.payload;
    },
    setIsClassifying: (state, action) => {
      state.isClassifying = action.payload;
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    overrideCategory: (state, action) => {
      if (state.classification) {
        state.classification.category = action.payload;
      }
    },
    overrideType: (state, action) => {
      if (state.classification) {
        state.classification.type = action.payload;
      }
    },
  },
});

export const {
  openModal,
  closeModal,
  setContent,
  setClassification,
  setIsClassifying,
  setIsSaving,
  overrideCategory,
  overrideType,
} = captureSlice.actions;
export default captureSlice.reducer;
