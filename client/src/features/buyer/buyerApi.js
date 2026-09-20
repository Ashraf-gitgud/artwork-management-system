import { baseApi } from '../../api/baseApi';

export const buyerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBuyers: builder.query({
      query: () => '/buyers',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Buyer', id: _id })),
              { type: 'Buyer', id: 'LIST' },
            ]
          : [{ type: 'Buyer', id: 'LIST' }],
    }),
    getBuyerById: builder.query({
      query: (id) => `/buyers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Buyer', id }],
    }),
    createBuyer: builder.mutation({
      query: (body) => ({
        url: '/buyers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Buyer', id: 'LIST' }],
    }),
    updateBuyer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/buyers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Buyer', id },
        { type: 'Buyer', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBuyersQuery,
  useGetBuyerByIdQuery,
  useCreateBuyerMutation,
  useUpdateBuyerMutation,
} = buyerApi;