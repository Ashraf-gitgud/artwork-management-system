import { baseApi } from '../../api/baseApi';

export const artistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArtists: builder.query({
      query: () => '/artists',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Artist', id: _id })),
              { type: 'Artist', id: 'LIST' },
            ]
          : [{ type: 'Artist', id: 'LIST' }],
    }),
    getArtistById: builder.query({
      query: (id) => `/artists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Artist', id }],
    }),
    createArtist: builder.mutation({
      query: (body) => ({
        url: '/artists',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Artist', id: 'LIST' }],
    }),
    updateArtist: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/artists/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Artist', id },
        { type: 'Artist', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetArtistsQuery,
  useGetArtistByIdQuery,
  useCreateArtistMutation,
  useUpdateArtistMutation,
} = artistApi;