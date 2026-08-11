import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { subscribeAction } from '@/components/common/Newsletter/actions';
import type { AsyncState } from '@/types/common';

/**
 * Newsletter submission state.
 *
 * React Hook Form owns field values and validation; this slice owns only the
 * *outcome* of a submit, because the result is shown outside the form and must
 * survive a re-render of the form itself.
 *
 * The contact form does NOT use this slice — it holds its own submit state locally,
 * because that result is shown inside the same card. A `submitContactForm` thunk
 * used to live here for the never-built Express API; nothing ever dispatched it, so
 * it went with that API layer.
 */
export interface ContactState {
  newsletter: {
    status: AsyncState;
    message: string | null;
  };
}

const initialState: ContactState = {
  newsletter: { status: 'idle', message: null },
};

export const subscribeToNewsletter = createAsyncThunk<
  { message: string },
  { email: string; source?: string },
  { rejectValue: { message: string } }
>('contact/subscribeNewsletter', async (payload, { rejectWithValue }) => {
  const result = await subscribeAction(payload.email);
  if (!result.ok) return rejectWithValue({ message: result.message });
  return { message: 'Thank you for subscribing!' };
});

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetNewsletter(state) {
      state.newsletter.status = 'idle';
      state.newsletter.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.newsletter.status = 'loading';
        state.newsletter.message = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.newsletter.status = 'succeeded';
        state.newsletter.message = action.payload.message;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.newsletter.status = 'failed';
        state.newsletter.message =
          action.payload?.message ?? 'Subscription failed. Please try again.';
      });
  },
});

export const { resetNewsletter } = contactSlice.actions;
export const contactReducer = contactSlice.reducer;
