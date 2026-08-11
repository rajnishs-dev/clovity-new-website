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
  status: AsyncState;
  message: string | null;
  fieldErrors: Record<string, string[]>;
  /** Epoch ms of the last successful submit - drives the "already sent" UI. */
  lastSubmittedAt: number | null;
  newsletter: {
    status: AsyncState;
    message: string | null;
  };
}

const initialState: ContactState = {
  newsletter: { status: 'idle', message: null },
};

export const submitContactForm = createAsyncThunk<
  { message: string },
  ContactSubmission,
  { rejectValue: { message: string; fieldErrors?: Record<string, string[]> } }
>('contact/submit', async (payload, { rejectWithValue }) => {
  const result = await formsApi.submitContact(payload);
  if (!result.success) {
    return rejectWithValue({
      message: result.message,
      ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
    });
  }
  return { message: 'Thanks - our team responds within one business day.' };
});

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
