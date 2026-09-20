import { baseApi } from '../../api/baseApi';

export const artworkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArtworks: builder.query({
      query: () => '/artworks',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Artwork', id: _id })),
              { type: 'Artwork', id: 'LIST' },
            ]
          : [{ type: 'Artwork', id: 'LIST' }],
    }),
    getArtworkById: builder.query({
      query: (id) => `/artworks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Artwork', id }],
    }),
    createArtwork: builder.mutation({
      query: (body) => ({
        url: '/artworks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Artwork', id: 'LIST' }],
    }),
    updateArtwork: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/artworks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Artwork', id },
        { type: 'Artwork', id: 'LIST' },
      ],
    }),
    changeArtworkStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/artworks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Artwork', id },
        { type: 'Artwork', id: 'LIST' },
      ],
    }),
    sellArtwork: builder.mutation({
      query: ({ id, buyerCin }) => ({
        url: `/artworks/${id}/sell`,
        method: 'PATCH',
        body: { buyerCin },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Artwork', id },
        { type: 'Artwork', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetArtworksQuery,
  useGetArtworkByIdQuery,
  useCreateArtworkMutation,
  useUpdateArtworkMutation,
  useChangeArtworkStatusMutation,
  useSellArtworkMutation,
} = artworkApi;