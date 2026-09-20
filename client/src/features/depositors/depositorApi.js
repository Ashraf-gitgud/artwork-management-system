import { baseApi } from '../../api/baseApi';

export const depositorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepositors: builder.query({
      query: () => '/depositors',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Depositor', id: _id })),
              { type: 'Depositor', id: 'LIST' },
            ]
          : [{ type: 'Depositor', id: 'LIST' }],
    }),
    getDepositorById: builder.query({
      query: (id) => `/depositors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Depositor', id }],
    }),
    createDepositor: builder.mutation({
      query: (body) => ({
        url: '/depositors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Depositor', id: 'LIST' }],
    }),
    updateDepositor: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/depositors/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Depositor', id },
        { type: 'Depositor', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDepositorsQuery,
  useGetDepositorByIdQuery,
  useCreateDepositorMutation,
  useUpdateDepositorMutation,
} = depositorApi;